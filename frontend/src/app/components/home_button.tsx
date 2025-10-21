// HomeButton

'use client';
import { FaHome } from 'react-icons/fa';
import styles from './header.module.css';
export default function homeButton() {
  const home = async () => {
    window.location.href = '/dashboard/';
  };

  return (
    <button className={styles.logoutContainer} onClick={home}>
      <FaHome></FaHome>
      <span>Home</span>
    </button>
  );
}
