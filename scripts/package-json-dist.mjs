/**
 * Modifies the package.json file so that it is suitable for distribution.
 * This includes removing any dev dependencies and setting up the correct export paths.
 *
 * @param {string} json - The package.json file contents
 */
export function packageJsonDist(
    json,
    options = {}
) {
    const originalPackage = JSON.parse(json);
    const { nameOverride } = options;

    /* eslint no-unused-vars: "off" */

    // We want to remove several fields from our development package.json
    // in order to construct our production one.
    const {
        private: _ignore,
        exports: _ignore2,
        files: _ignore3,
        jest: _ignore4,
        scripts: _ignore5,
        devDependencies: _ignore6,
        typesVersions: _ignore7,
        wireit: _ignore8,
        ...distPackage
    } = originalPackage;

    // by adding back "exports" in a clever way, we can allow for directory-style importing without
    // having to change the package type away from "module"
    distPackage.exports = {
        ".": {
            import: "./index.js",
            require: "./index.cjs",
            types: "./index.d.ts",
        },
        "./*js": "./*js",
        "./*": {
            import: "./*/index.js",
            require: "./*/index.cjs",
            types: "./*/index.d.ts",
        },
        "./*/index": {
            import: "./*/index.js",
            require: "./*/index.cjs",
        },
    };
    distPackage.main = "index.js";
    distPackage.files = ["**/*ts", "**/*js", "**/*.map", "**/*.json"];

    if (nameOverride) {
        distPackage.name = nameOverride;
    }

    if (
        typeof distPackage.name === "string" &&
        distPackage.name.startsWith("@")
    ) {
        distPackage.publishConfig = {
            ...(distPackage.publishConfig ?? {}),
            access: "public",
        };
    }

    return JSON.stringify(distPackage, null, 4);
}
