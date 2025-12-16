const path = require('path');
const libraryName = path.basename(__dirname); 
const projectRoot = path.resolve(__dirname, '../..');

module.exports = {
    branches: ["main"],
    tagFormat: libraryName + '@${version}',
    plugins: [
        ["@semantic-release/commit-analyzer", {
            preset: "conventionalcommits",
            releaseRules: [
                { type: "docs", release: null },
                { type: "feat", release: "minor" },
                { type: "fix", release: "patch" },
                { type: "chore", release: null },
                { type: "refactor", release: "patch" },
                { type: "style", release: null },
                { type: "test", release: null },
                { scope: "release", release: "patch" },
                { breaking: true, release: "major" }
            ],
            parserOpts: {
                noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
            }
        }],
        "@semantic-release/release-notes-generator",
        ["@semantic-release/changelog", {
            changelogFile: "CHANGELOG.md",
        }],
        [
            "@semantic-release/npm",
            {
                "npmPublish": true,
                "pkgRoot": path.join(projectRoot, 'dist', libraryName),
            }
        ],
        [
            "@semantic-release/exec",
            {
                prepareCmd: "npm version ${nextRelease.version} --no-git-tag-version",
            },
        ],
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "package.json"],
                message: `chore(release): ${libraryName} ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}`
            },
        ],
        "@semantic-release/github",
    ],
    repositoryUrl: "https://github.com/Micael-Macedo/opalbytes-angular-lib.git",
};
