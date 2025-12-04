module.exports = {
    branches: ["main"],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        [
            "@semantic-release/npm",
            {
                "npmPublish": true,
                "pkgRoot": "./dist/ngx-opalbytes-directives",
            }
        ],
        [
            "@semantic-release/exec",
            {
                prepareCmd: "npm version ${nextRelease.version} --no-git-tag-version --prefix projects/ngx-opalbytes-directives",
            },
        ],
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "package.json", "package-lock.json", "projects/ngx-opalbytes-directives/package.json"],
                message: "docs: ${nextRelease.version}",
            },
        ],
        "@semantic-release/github",
    ],
    repositoryUrl: "https://github.com/Micael-Macedo/opalbytes-directive-components",
};
