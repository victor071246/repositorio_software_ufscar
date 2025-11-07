'use client';
if (typeof window === 'undefined') {
  console.log('🚨 Executando no servidor!');
}
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/pages/login');
  };

  return (
    <button className={styles.logoutContainer} onClick={logout}>
      <FaSignOutAlt />
      <span>Sair</span>
    </button>
  );
}
