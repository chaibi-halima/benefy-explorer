// SessionStart : donne à Claude l'état du dépôt et l'avancement du backlog dès le début de session.
import fs from 'node:fs';
import path from 'node:path';
import { git, projectDir } from './_lib.mjs';

const lines = [];
const branch = git(['branch', '--show-current']);
if (branch === null) {
  lines.push('Le dossier n’est pas encore un dépôt git.');
} else {
  const status = git(['status', '--short']) ?? '';
  const changed = status ? status.split('\n').length : 0;
  lines.push(`Branche git courante : ${branch || '(détachée)'} ; fichiers modifiés non commités : ${changed}.`);
}

const backlogPath = path.join(projectDir, 'docs', 'BACKLOG.md');
if (fs.existsSync(backlogPath)) {
  const md = fs.readFileSync(backlogPath, 'utf8');
  const progress = [];
  for (const section of md.split(/^### /m).slice(1)) {
    const id = section.match(/^([A-Z0-9]+-\d+)/)?.[1];
    if (!id) continue;
    const done = (section.match(/- \[x\]/gi) ?? []).length;
    const total = done + (section.match(/- \[ \]/g) ?? []).length;
    progress.push(`${id} ${done}/${total}`);
  }
  lines.push(`Avancement du backlog (cases cochées) : ${progress.join(', ')}.`);
}

process.stdout.write(lines.join('\n'));
