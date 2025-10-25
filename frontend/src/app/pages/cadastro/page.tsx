'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import styles from './cadastro.module.css';
import Header from '@/app/components/header';

type UserPayload = {
  id: number;
  usuario: string;
  admin: boolean;
  supervisor: boolean;
};

export default function CadastroPage() {
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [supervisor, setSupervisor] = useState(false);
  const [departamento, setDepartamento] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLogged, setUserLogged] = useState<UserPayload | null>(null);
  const [saving, setSaving] = useState(false);

  // Pegar info do usuário logado
  useEffect(() => {
    fetch('/api/usuarios_cookie')
      .then((res) => res.json())
      .then((data: UserPayload) => {
        setUserLogged(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!userLogged) {
      setErro('Você precisa estar logado.');
      return;
    }

    // Permissão: supervisor só cria usuários comuns
    if (userLogged.supervisor && supervisor) {
      setErro('Você não tem permissão para criar um supervisor.');
      return;
    }

    setSaving(true);
    setErro('');

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, nome, senha, supervisor, departamento }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Erro ao criar usuário');
      } else {
        alert('Usuário criado com sucesso!');
        setUsuario('');
        setSenha('');
        setNome('');
        setConfirmar('');
        setSupervisor(false);
      }
    } catch (e) {
      setErro('Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <div className={styles.bodyContainer}>
        <Header></Header>
        <div className={styles.loginContainer}>
          <h2 className={styles.loginTitle}>Cadastro de Usuário</h2>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="text"
              placeholder="Departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className={styles.loginInput}
              required
            />

            {!!userLogged?.admin && (
              <div className={styles.checkboxContainer}>
                <label>
                  <input
                    type="checkbox"
                    checked={supervisor}
                    onChange={(e) => setSupervisor(e.target.checked)}
                  />
                  Criar como supervisor
                </label>
              </div>
            )}

            <p className={styles.erro}>{erro}</p>

            <button type="submit" className={styles.loginButton} disabled={saving}>
              {saving ? 'Salvando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
