'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/header';
import styles from './visualizar_usuario.module.css';

type Usuario = {
  id: number;
  usuario: string;
  nome: string;
  departamento: string;
  admin: boolean;
  supervisor: boolean;
};

type UserLogged = {
  id: number;
  admin: boolean;
  supervisor: boolean;
};

export default function VisualizarUsuarioComponent() {
  const searchParams = useSearchParams();
  const usuarioId = searchParams.get('id');
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLogged, setUserLogged] = useState<UserLogged | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch('/api/usuarios_cookie')
      .then(res => res.json())
      .then((data: UserLogged) => setUserLogged(data));
  }, []);

  useEffect(() => {
    if (!usuarioId) return;
    fetch(`/api/usuarios/${usuarioId}`)
      .then(res => res.json())
      .then((data: Usuario) => setUsuario(data))
      .finally(() => setLoading(false));
  }, [usuarioId]);

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não encontrado.</p>;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Informações do Usuário</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.info}>
          <p><strong>Nome:</strong> {usuario.nome}</p>
        </div>
      </main>
    </>
  );
}
