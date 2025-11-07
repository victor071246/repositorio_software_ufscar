'use client';
if (typeof window === 'undefined') {
  console.log('🚨 Executando no servidor!');
}
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

export default function HomeButton() {
  const router = useRouter();

  const goHome = () => {
    router.push('/dashboard');
  };

  return (
    <button className={styles.logoutContainer} onClick={goHome}>
      <FaHome />
      <span>Home</span>
    </button>
  );
}
