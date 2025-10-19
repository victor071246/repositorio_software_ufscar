'use client';

import { useState } from 'react';
import styles from '../redefinir_senha/redefinir_senha.module.css';
import Link from 'next/link';

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState<'erro' | 'sucesso' | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem');
      setStatus('erro');
      return;
    }
  };

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

            <button className={styles.button}>Salvar nova senha</button>

            <p className={styles.login}>
              <Link href={'/dashboard'}>Voltar à dashboard</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
