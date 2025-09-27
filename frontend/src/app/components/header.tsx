import { getUserFromRequest } from '@/lib/auth';
import styles from './header.module.css';
import { FaSignOutAlt } from 'react-icons/fa';

export default async function Header() {
  const user = await getUserFromRequest();

  const logout = () => {
    document.cookie = 'token=; path=/; max-age=0';

    window.location.href = '/login';
  };
  return (
    <>
      <header className={styles.header}>
        <div className={styles.userArea}>
          <>
            <span>Bem vindo, {user!.usuario}</span>
            <button className={styles.logoutButton} onClick={logout}>
              <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
              Sair
            </button>
          </>
        </div>
      </header>
    </>
  );
}
