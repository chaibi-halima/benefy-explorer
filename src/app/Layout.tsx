import { NavLink, Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { Button } from '@/shared/ui/Button';
import styles from './Layout.module.scss';

const links = [
  { to: '/', label: 'Accueil', icon: '🏠', end: true },
  { to: '/explorer', label: 'Explorer', icon: '🧭', end: false },
  { to: '/transactions', label: 'Opérations', icon: '📄', end: false },
];

export function Layout() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip}>
        Aller au contenu
      </a>
      <header className={styles.topbar}>
        <span className={styles.logo}>Benefy</span>
        <div className={styles.user}>
          <span className={styles.company}>{user?.company}</span>
          <Button
            variant="ghost"
            onClick={() => {
              queryClient.clear(); // ne pas laisser les données d'un utilisateur en cache
              logout();
            }}
          >
            Se déconnecter
          </Button>
        </div>
      </header>

      <nav className={styles.nav} aria-label="Navigation principale">
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={({ isActive }) => (isActive ? styles.active : undefined)}>
                <span aria-hidden="true">{l.icon}</span>
                <span>{l.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
