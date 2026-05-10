/**
 * Autogenerate a package.json file for a release build.
 *
 * run with
 * ```
 * node scripts/make-package.ts
 * ```
 */
import fs from "node:fs/promises";
import { packageJsonDist } from "./package-json-dist.mjs";

(async () => {
    const json = await fs.readFile("./package.json", "utf-8");
    const originalPackage = JSON.parse(json);
    const packageNameOverride = process.env.PACKAGE_NAME_OVERRIDE?.trim();

    await fs.mkdir("dist", { recursive: true });
    const filename = "dist/package.json";
    console.log("writing", filename);
    await fs.writeFile(
        filename,
        packageJsonDist(json, { nameOverride: packageNameOverride }),
        "utf-8"
    );

    // Copy the readme
    try {
        let readme = await fs.readFile("./README.md", "utf-8");
        if (packageNameOverride && originalPackage.name) {
            readme = readme.split(originalPackage.name).join(packageNameOverride);
        }
        const filename = "dist/README.md";

        console.log("writing", filename);
        await fs.writeFile(filename, readme, "utf-8");
    } catch (e) {
        console.log("failed to copy readme");
    }
})();

export {};
