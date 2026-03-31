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

/**
 * Register environment signatures for PreTeXt-specific environments.
 * These are environments whose names don't exist in any CTAN package, so
 * the parser needs to be told to consume an optional `[title]` argument.
 * Add new environment names here when they are handled in environment-subs.ts
 * but not already defined in the unified-latex-ctan packages.
 */
export const environments: EnvInfoRecord = {
    // AsideLike
    aside: { signature: "o" },
    biographical: { signature: "o" },
    historical: { signature: "o" },
    // Assemblage
    assemblage: { signature: "o" },
    // ProjectLike
    activity: { signature: "o" },
    // ComputationLike
    computation: { signature: "o" },
    technology: { signature: "o" },
    data: { signature: "o" },
    // Case (sub-element of proof)
    case: { signature: "o" },
};
