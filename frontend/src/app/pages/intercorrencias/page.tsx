'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/header';
import styles from './intercorrencias.module.css';

type IntercorrenciaComUsuario = {
  id: number;
  titulo: string;
  descricao: string;
  usuario_id: number;
  criado_em: string;
  usuario_nome: string;
};

export default function IntercorrenciasPage() {
  const searchParams = useSearchParams();
  const equipamentoId = searchParams.get('equipamentoId');

  const [intercorrencias, setIntercorrencias] = useState<IntercorrenciaComUsuario[]>([]);
  const [erro, setErro] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!equipamentoId) return;
      setErro('');

      try {
        const response = await fetch(`/api/intercorrencias/${equipamentoId}`);
        if (!response.ok) throw new Error('Falha ao carregar intercorrências');
        const data = await response.json();
        setIntercorrencias(data);
      } catch (e) {
        setErro('Erro ao buscar intercorrências');
        console.error(e);
      }
    }

    carregar();
  }, [equipamentoId]);

  async function excluirIntercorrencia(id: number) {
    try {
      const response = await fetch('/api/intercorrencias', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Erro ao excluir intercorrência');
      setIntercorrencias((value) => value.filter((item) => item.id !== id));
    } catch (e) {
      console.log(e);
    }
  }

  async function adicionarIntercorrencia(
    equipamento_id: string,
    titulo: string,
    descricao: string,
  ) {
    try {
      if (!titulo.trim() || !descricao.trim()) {
        alert('Preencha título e descrição antes de criar.');
        return;
      }

      const response = await fetch('/api/intercorrencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipamento_id,
          titulo,
          descricao,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Erro ao criar intercorrência');
        return;
      }

      const data = await response.json();
      const dataDoDia = new Date();
      setMensagem(`Nova intercorrência criada às ${dataDoDia.toLocaleString('pt-BR')}`);
      setIntercorrencias((prev) => [...prev, data]);
      setTitulo('');
      setDescricao('');
      fecharPopup();
    } catch (e) {
      console.log(e);
    }
  }

  function abrirPopup() {
    setMostrarPopup(true);
  }

  function fecharPopup() {
    setMostrarPopup(false);
    setMensagem('');
    setTitulo('');
    setDescricao('');
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.divSuperior}>
          <h1 className={styles.titulo}>Intercorrências do Equipamento #{equipamentoId}</h1>
          <button className={styles.botaoAdicionarIntercorrencia} onClick={abrirPopup}>
            Criar Intercorrência
          </button>
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}

        {/* POPUP DE CRIAÇÃO */}
        {mostrarPopup && (
          <div className={styles.popupFullScreen}>
            <div className={styles.divCriarIntercorrenciaForm}>
              <h4>{mensagem}</h4>

              <div className={styles.boxTitulo}>
                <label>Título</label>
                <input
                  className={styles.input}
                  type="text"
                  required
                  onChange={(e) => setTitulo(e.target.value)}
                  value={titulo}
                />
              </div>

              <div className={styles.boxDescricao}>
                <label>Descrição</label>
                <textarea
                  onChange={(e) => setDescricao(e.target.value)}
                  className={styles.descricao}
                  value={descricao}
                ></textarea>
              </div>

              <button
                className={styles.botaoCriarIntercorrencia}
                onClick={() => adicionarIntercorrencia(equipamentoId!, titulo, descricao)}
              >
                Criar
              </button>

              {/* 🔻 botão de fechar modal */}
              <button className={styles.botaoFecharModal} onClick={fecharPopup}>
                Fechar
              </button>

              {/* ❌ canto superior direito */}
              <button className={styles.excluirModal} onClick={fecharPopup}>
                ❌
              </button>
            </div>
          </div>
        )}

        {/* LISTA DE INTERCORRÊNCIAS */}
        {intercorrencias.length === 0 ? (
          <p>Nenhuma intercorrência encontrada.</p>
        ) : (
          <ul className={styles.lista}>
            {intercorrencias.map((i) => (
              <li key={i.id} className={styles.item}>
                <div className={styles.info}>
                  <strong>{i.titulo}</strong>
                  <span>Criado por: {i.usuario_nome}</span>
                  <p>{i.descricao}</p>
                  <small>Criada em {new Date(i.criado_em).toLocaleString('pt-BR')}</small>
                </div>
                <button
                  className={styles.excluir}
                  onClick={() => excluirIntercorrencia(i.id)}
                  title="Excluir intercorrência"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
