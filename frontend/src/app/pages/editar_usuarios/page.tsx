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

export default function VisualizarUsuarioPage() {
  const searchParams = useSearchParams();
  const usuarioId = searchParams.get('usuarioId');

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLogged, setUserLogged] = useState<UserLogged | null>(null);
  const [resetting, setResetting] = useState(false);

  // Pegar usuário logado
  useEffect(() => {
    fetch('/api/usuarios_cookie')
      .then((res) => res.json())
      .then((data: UserLogged) => setUserLogged(data))
      .catch(() => {});
  }, []);

  // Buscar usuário específico
  useEffect(() => {
    if (!usuarioId) return;

    fetch(`/api/usuarios/${usuarioId}`)
      .then((res) => res.json())
      .then((data: Usuario) => setUsuario(data))
      .catch(() => setError('Erro ao carregar usuário.'))
      .finally(() => setLoading(false));
  }, [usuarioId]);

  const handleResetSenha = async () => {
    if (!usuario) return;

    // Apenas admin ou supervisor podem resetar senha
    if (
      !userLogged ||
      (!userLogged.admin && !(userLogged.supervisor && !usuario.supervisor && !usuario.admin))
    ) {
      setError('Você não tem permissão para resetar esta senha.');
      return;
    }

    setResetting(true);
    setError('');

    try {
      const res = await fetch(`/api/usuarios/${usuario.id}/reset-senha`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao resetar senha');
      }
      alert('Senha resetada para: 123456');
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Erro desconhecido');
    } finally {
      setResetting(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!usuario) return <p>Usuário não encontrado.</p>;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Informações do Usuário</h1>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.info}>
          <p>
            <strong>Nome:</strong> {usuario.nome}
          </p>
          <p>
            <strong>Usuário:</strong> {usuario.usuario}
          </p>
          <p>
            <strong>Departamento:</strong> {usuario.departamento}
          </p>
          <p>
            <strong>Admin:</strong> {usuario.admin ? 'Sim' : 'Não'}
          </p>
          <p>
            <strong>Supervisor:</strong> {usuario.supervisor ? 'Sim' : 'Não'}
          </p>
        </div>

        {(userLogged?.admin ||
          (userLogged?.supervisor && !usuario.supervisor && !usuario.admin)) && (
          <button className={styles.resetButton} onClick={handleResetSenha} disabled={resetting}>
            {resetting ? 'Resetando...' : 'Resetar Senha'}
          </button>
        )}
      </main>
    </>
  );
}
