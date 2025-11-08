'use client';
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
  const [dark, setDark] = useState(false);

  // Carrega preferências do tema do usuário
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDark(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Aplica mudança de tema global
  useEffect(() => {
    document.body.classList.toggle('dark-theme', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Busca usuário autenticado
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
