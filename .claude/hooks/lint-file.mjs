// PostToolUse (Edit|Write) : lance ESLint --fix sur le fichier modifié.
// S'il reste des erreurs, on les renvoie à Claude (decision: "block") pour qu'il les corrige tout de suite.
import { readInput, rel, runNodeBin, tail } from './_lib.mjs';

const input = await readInput();
const file = input.tool_input?.file_path;
if (!file || !/\.(ts|tsx|js|mjs)$/.test(file)) process.exit(0);

const target = rel(file);
if (target.startsWith('..') || target.startsWith('node_modules/')) process.exit(0);

const { code, output } = runNodeBin('node_modules/eslint/bin/eslint.js', ['--fix', target]);
if (code !== 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: `ESLint signale des problèmes dans ${target} après correction automatique :\n${tail(output, 3000)}`,
    }),
  );
}
