'use client';
if (typeof window === 'undefined') {
  console.log('🚨 Executando no servidor!');
}
import { useEffect, useState } from 'react';
import LogoutButton from './logout_button';
import ConfigButton from './config_button';
import HomeButton from './home_button';
import styles from './header.module.css';

type UserPayload = {
  id: number;
  usuario: string;
  admin: boolean;
  supervisor: boolean;
};

export default function Header() {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/usuarios_cookie');
        if (!res.ok) throw new Error('Não autenticado');
        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error('Erro ao buscar usuário:', e);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.userArea}>
        <span>Bem-vindo, {user?.usuario ?? '...'}</span>
        <div className={styles.icones}>
          <HomeButton />
          <ConfigButton />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
