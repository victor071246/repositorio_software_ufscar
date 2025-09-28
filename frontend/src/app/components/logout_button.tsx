// LoginButton

'use client';
import { FaSignOutAlt } from 'react-icons/fa';
import styles from './header.module.css';
export default function LogoutButton() {
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/pages/login';
  };

  return (
    <button className={styles.logoutContainer} onClick={logout}>
      <FaSignOutAlt></FaSignOutAlt>
      <span>Sair</span>
    </button>
  );
}
