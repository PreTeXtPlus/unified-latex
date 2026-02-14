import {
    MacroInfoRecord,
    EnvInfoRecord,
} from "@unified-latex/unified-latex-types";

/**
 * Register macro signatures for PreTeXt-specific macros.
 * Add new macro names here when they are handled in macro-subs.ts
 * but not already defined in the unified-latex-ctan packages.
 */
export const macros: MacroInfoRecord = {
    // PreTeXt-specific macro
    term: { signature: "m" },
};

export const environments: EnvInfoRecord = {};
