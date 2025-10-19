// ConfigButton
'use client';

import { FaCog } from 'react-icons/fa';
import styles from './header.module.css';
export default function ConfigButton() {
  const config = () => {
    window.location.href = '/pages/redefinir_senha';
  };

  return (
    <button className={styles.configContainer} onClick={config}>
      <FaCog>Alterar Senha</FaCog>
      <span>Configurações</span>
    </button>
  );
}
