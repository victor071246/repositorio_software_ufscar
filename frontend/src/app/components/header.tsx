import { getUserFromServer } from '@/lib/auth';
import LogoutButton from './logout_button';
import styles from './header.module.css';

export default async function Header() {
  const user = await getUserFromServer();

  return (
    <header className={styles.header}>
      <div className={styles.userArea}>
        <span>Bem vindo, {user?.usuario}</span>
        <LogoutButton></LogoutButton>
      </div>
    </header>
  );
}
