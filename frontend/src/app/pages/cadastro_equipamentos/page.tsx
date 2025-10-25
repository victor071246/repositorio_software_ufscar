'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

import { useState } from 'react';
import Header from '@/app/components/header';
import styles from './cadastro_equipamentos.module.css';

export default function CriarEquipamentosPage() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/equipamentos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, descricao }),
      });

      if (!res.ok) throw new Error('Erro ao criar equipamento');

      setMensagem('Equipamento criado com sucesso!');
      setNome('');
      setDescricao('');
    } catch (e) {
      console.error('Erro ao criar um equipamento: ', e);
      setMensagem('Erro ao criar equipamento');
    }
  };

  return (
    <>
      <div className={styles.body}>
        <Header></Header>

        <main className={styles.container}>
          <h1 className={styles.titulo}>Criar Novo Equipamento</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Nome:
              <input
                className={styles.input}
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>
            <label className={styles.label}>
              Descrição:
              <textarea
                className={styles.textarea}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              ></textarea>
            </label>
            <button className={styles.submitButton}>Cadastrar</button>
          </form>
          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </main>
      </div>
    </>
  );
}
