'use client';
if (typeof window === 'undefined') {
  console.log('🚨 Executando no servidor!');
}
import { FaCog } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

export default function ConfigButton() {
  const router = useRouter();

  const goToConfig = () => {
    router.push('/pages/redefinir_senha');
  };

  return (
    <button className={styles.configContainer} onClick={goToConfig}>
      <FaCog />
      <span>Configurações</span>
    </button>
  );
}
