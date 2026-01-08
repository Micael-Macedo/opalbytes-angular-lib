module.exports = {
    branches: ["main"],
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
        "@semantic-release/changelog",
        [
            "@semantic-release/exec",
            {
                prepareCmd: "npm version ${nextRelease.version} --no-git-tag-version --prefix",
            },
        ],
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "package.json", "package-lock.json", "metrics-reports/latest.html"],
            },
        ],
        "@semantic-release/github",
    ],
    repositoryUrl: "https://github.com/Micael-Macedo/opalbytes-angular-lib",
};