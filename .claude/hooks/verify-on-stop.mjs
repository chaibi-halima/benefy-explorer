// Stop : avant que Claude rende la main, vérifie le typage et lance les tests liés aux fichiers modifiés.
// En cas d'échec, Claude est relancé avec l'erreur. stop_hook_active évite de boucler indéfiniment.
import fs from 'node:fs';
import path from 'node:path';
import { git, projectDir, readInput, runNodeBin, tail } from './_lib.mjs';

const input = await readInput();
if (input.stop_hook_active) process.exit(0);

// Fichiers modifiés depuis le dernier commit + nouveaux fichiers non suivis
const modified = git(['diff', '--name-only', 'HEAD']);
const untracked = git(['ls-files', '--others', '--exclude-standard']);
if (modified === null || untracked === null) process.exit(0); // pas de dépôt git ou aucun commit

const changed = `${modified}\n${untracked}`
  .split('\n')
  .map((f) => f.trim())
  .filter((f) => /^(src|e2e)\/.*\.(ts|tsx)$/.test(f) && fs.existsSync(path.join(projectDir, f)));
if (changed.length === 0) process.exit(0);

const problems = [];

const tsc = runNodeBin('node_modules/typescript/bin/tsc', ['-b', '--noEmit', '--pretty', 'false']);
if (tsc.code !== 0) problems.push(`TypeScript :\n${tail(tsc.output, 2500)}`);

const srcFiles = changed.filter((f) => f.startsWith('src/'));
if (srcFiles.length > 0) {
  const jest = runNodeBin('node_modules/jest/bin/jest.js', ['--findRelatedTests', ...srcFiles, '--passWithNoTests', '--silent']);
  if (jest.code !== 0) problems.push(`Tests Jest liés aux fichiers modifiés :\n${tail(jest.output, 3000)}`);
}

if (problems.length > 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: `La vérification automatique a échoué. Corrige avant de terminer :\n\n${problems.join('\n\n')}`,
    }),
  );
}
