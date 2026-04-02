import util from "util";
import * as Ast from "@unified-latex/unified-latex-types";
import { strToNodes } from "../../test-common";
import { arg, args, env, m, s } from "@unified-latex/unified-latex-builder";

/* eslint-env jest */

// Make console.log pretty-print by default
const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("unified-latex-ctan:listings", () => {
    it("Parses 'lstlisting' environment with optional arguments", () => {
        const EXAMPLES: [string, Ast.Node[]][] = [
            [
                "\\begin{lstlisting}[caption=Test]\nHello, I'm a listing.\n\\end{lstlisting}",
                [
                    env(
                        "lstlisting",
                        s("\nHello, I'm a listing.\n"),
                        args([
                            arg([s("caption"), s("="), s("Test")], {
                                braces: "[]",
                            }),
                        ])
                    ),
                ],
            ],
        ];

        for (const [inStr, expectedParse] of EXAMPLES) {
            expect(strToNodes(inStr)).toEqual(expectedParse);
        }
    });
});
