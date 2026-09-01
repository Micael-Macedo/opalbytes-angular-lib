'use strict';

const { execFileSync } = require('child_process');

const VALID_SCOPES = [
  'core',
  'utils',
  'services',
  'directives',
  'components',
  'performance',
  'shared',
  'pdf',
  'video',
  'chart',
];

// Extracts the library scope from a PR/feature branch name,
// e.g. "feature(components)/add-component" or "fix(services)/correcao".
const BRANCH_SCOPE_RE = /(?:feat|fix|feature|docs|chore|refactor|test|style|release)\(([a-z-]+)\)\//i;

let commitScopeCache = null;

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function gitSilent(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch (err) {
    return null;
  }
}

/**
 * Builds a map of commit hash -> library scope by scanning every PR merge in the
 * first-parent history. Commits introduced by a PR merge (rev-list M^1..M) are
 * attributed to the scope found in that PR's branch name.
 */
function loadCommitScopes() {
  if (commitScopeCache) {
    return commitScopeCache;
  }
  const map = new Map();
  const merges = gitSilent(['log', '--first-parent', '--merges', '--pretty=format:%H%x00%P%x00%s']);
  if (!merges) {
    commitScopeCache = map;
    return map;
  }
  for (const line of merges.split('\n')) {
    const [mergeHash, parentsRaw, subject] = line.split('\x00');
    const parents = parentsRaw.split(' ');
    const match = subject.match(BRANCH_SCOPE_RE);
    if (!match || parents.length < 2) {
      continue;
    }
    const scope = match[1].toLowerCase();
    if (!VALID_SCOPES.includes(scope)) {
      continue;
    }
    map.set(mergeHash.slice(0, 7), scope);
    const firstParent = parents[0];
    try {
      const commits = execFileSync('git', ['rev-list', `${firstParent}..${mergeHash}`], {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .trim()
        .split('\n')
        .filter(Boolean);
      for (const hash of commits) {
        map.set(hash.slice(0, 7), scope);
      }
    } catch (err) {
      // ignore unmerged ranges
    }
  }
  commitScopeCache = map;
  return map;
}

/**
 * Returns the library scope that introduced the given commit into main, or null.
 */
function getCommitScope(commitHash) {
  if (!commitHash) {
    return null;
  }
  const scopes = loadCommitScopes();
  return scopes.get(commitHash.slice(0, 7)) || null;
}

function stripLibraryScope(config) {
  const { libraryScope, ...rest } = config;
  return rest;
}

function filterCommits(context, libraryScope) {
  return (context.commits || []).filter((c) => getCommitScope(c.hash) === libraryScope);
}

/**
 * Semantic-release plugin that delegates `analyzeCommits` and `generateNotes` to
 * the standard plugins, pre-filtering the commits so each library only sees the
 * ones introduced by branches scoped to it (e.g. feature(components)/...).
 */
async function analyzeCommits(pluginConfig, context) {
  const { libraryScope } = pluginConfig;
  let commitAnalyzer;
  try {
    commitAnalyzer = require('@semantic-release/commit-analyzer');
  } catch (err) {
    commitAnalyzer = await import('@semantic-release/commit-analyzer');
  }
  const filteredCommits = filterCommits(context, libraryScope);
  return commitAnalyzer.analyzeCommits(stripLibraryScope(pluginConfig), {
    ...context,
    commits: filteredCommits,
  });
}

async function generateNotes(pluginConfig, context) {
  const { libraryScope } = pluginConfig;
  let releaseNotesGenerator;
  try {
    releaseNotesGenerator = require('@semantic-release/release-notes-generator');
  } catch (err) {
    releaseNotesGenerator = await import('@semantic-release/release-notes-generator');
  }
  const filteredCommits = filterCommits(context, libraryScope);
  return releaseNotesGenerator.generateNotes(stripLibraryScope(pluginConfig), {
    ...context,
    commits: filteredCommits,
  });
}

module.exports = {
  analyzeCommits,
  generateNotes,
  VALID_SCOPES,
  BRANCH_SCOPE_RE,
  loadCommitScopes,
  getCommitScope,
};