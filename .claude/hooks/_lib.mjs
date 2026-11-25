// Utilitaires partagés par les hooks. Écrits en Node pour marcher sous macOS, Linux et Windows.
import { spawnSync } from 'node:child_process';
import path from 'node:path';

export const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

/** Lit le JSON envoyé par Claude Code sur stdin. */
export async function readInput() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

/** Lance un binaire Node du projet (eslint, tsc, jest) sans dépendre de npx ni du shell. */
export function runNodeBin(relBin, args) {
  const res = spawnSync(process.execPath, [path.join(projectDir, relBin), ...args], {
    cwd: projectDir,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', CI: 'true' },
  });
  return { code: res.status ?? 1, output: `${res.stdout ?? ''}${res.stderr ?? ''}`.trim() };
}

export function git(args) {
  const res = spawnSync('git', args, { cwd: projectDir, encoding: 'utf8' });
  return res.status === 0 ? res.stdout.trim() : null;
}

export const rel = (file) => path.relative(projectDir, path.resolve(projectDir, file)).split(path.sep).join('/');

/** Garde la fin d'une sortie longue : c'est là que sont les erreurs utiles. */
export const tail = (text, max = 4000) => (text.length > max ? `…\n${text.slice(-max)}` : text);
