'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'edge';

import { useState } from 'react';
import { FormEvent } from 'react';
import styles from '../redefinir_senha/redefinir_senha.module.css';
import Link from 'next/link';

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState<'erro' | 'sucesso' | ''>('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!senhaAntiga) {
      setMensagem('Precisa enviar sua nova antiga');
      setStatus('erro');
      return;
    }

    if (!novaSenha) {
      setMensagem('Precisa enviar sua nova senha');
      setStatus('erro');
      return;
    }

    if (!confirmarSenha) {
      setMensagem('Precisa confirmar sua nova senha');
      setStatus('erro');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem');
      setStatus('erro');
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAntiga, novaSenha }),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar nova senha');

      const logout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/pages/login';
      };
      logout();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>RedefinirSenha</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Senha atual"
              className={styles.input}
              onChange={(e) => setSenhaAntiga(e.target.value)}
              value={senhaAntiga}
              required
            ></input>
            <input
              type="password"
              placeholder="Digite sua nova senha"
              className={styles.input}
              onChange={(e) => setNovaSenha(e.target.value)}
              value={novaSenha}
              required
            ></input>
            <input
              type="password"
              placeholder="Confirme a nova senha"
              className={styles.input}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              value={confirmarSenha}
              required
            ></input>

            {mensagem && (
              <p className={status === 'erro' ? styles.erro : styles.sucesso}>{mensagem}</p>
            )}

            <button onClick={handleSubmit} className={styles.button}>
              Salvar nova senha
            </button>

            <p className={styles.login}>
              <Link href={'/dashboard'}>Voltar à dashboard</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
