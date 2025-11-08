'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const [dark, setDark] = useState(false);

  // 🔹 Carrega preferências de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDark(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // 🔹 Aplica mudanças de tema globalmente
  useEffect(() => {
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // 🔹 Busca o usuário autenticado
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
      {/* 🔹 Logo absoluta (volta para a página inicial ao clicar) */}
      <Link href="/">
<img
  src="/lbga.png"
  alt="Logo"
  className={styles.logo}
  draggable={false}
/>
      </Link>

      <div className={styles.userArea}>
        <span>Bem-vindo, {user?.usuario ?? '...'}</span>

        <div className={styles.icones}>
          <HomeButton />
          <ConfigButton />
          <LogoutButton />

          {/* 🔘 Botão de alternância de tema */}
          <button
            onClick={() => setDark(!dark)}
            className={styles.themeButton}
            title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
