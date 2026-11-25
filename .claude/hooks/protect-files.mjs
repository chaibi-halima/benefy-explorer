// PreToolUse (Edit|Write) : empêche Claude de modifier des fichiers générés ou sensibles.
// Exit 2 = l'outil est bloqué et le message de stderr est renvoyé à Claude.
import { readInput, rel } from './_lib.mjs';

const RULES = [
  { test: (f) => f === 'package-lock.json', why: 'il est généré : utilise `npm install <paquet>`' },
  { test: (f) => f === 'public/mockServiceWorker.js', why: 'il est généré par `npx msw init public`' },
  { test: (f) => /(^|\/)\.env(\.|$)/.test(f), why: 'il peut contenir des secrets' },
  { test: (f) => f.startsWith('node_modules/') || f.startsWith('dist/'), why: 'c’est un dossier généré' },
];

const input = await readInput();
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const target = rel(file);
const rule = RULES.find((r) => r.test(target));
if (rule) {
  process.stderr.write(`Modification de ${target} refusée par le hook protect-files : ${rule.why}.`);
  process.exit(2);
}
