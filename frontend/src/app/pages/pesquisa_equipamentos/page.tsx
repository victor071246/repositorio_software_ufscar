'use client';
import { useState } from 'react';
import Header from '@/app/components/header';
import SearchBar from '@/app/components/search_bar';
import styles from './pesquisa_equipamentos.module.css';
import { useRouter } from 'next/navigation';

type Equipamento = {
  id: number;
  nome: string;
  descricao: string;
};

export default function PesquisaEquipamentosPage() {
  const [resultados, setResultados] = useState<Equipamento[]>([]);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleSearch = async (query: string) => {
    try {
      const res = await fetch(`/api/equipamentos?nome=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Erro ao buscar equipamentos');
      const data = await res.json();
      setResultados(data);
      if (data.length === 0) setMensagem('Nenhum equipamento encontrado.');
      else setMensagem('');
    } catch (e: unknown) {
      setMensagem(e instanceof Error ? e.message : 'Erro desconhecido');
      setResultados([]);
    }
  };

  return (
    <>
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>
          <h1 className={styles.title}>Pesquisar Equipamentos</h1>

          <SearchBar onSearch={handleSearch} />

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}

          <ul className={styles.lista}>
            {resultados.map((eq) => (
              <li
                key={eq.id}
                className={styles.item}
                onClick={() => router.push(`/pages/visualizar_equipamento?equipamentoId=${eq.id}`)}
              >
                <strong>{eq.nome}</strong> - {eq.descricao}
              </li>
            ))}
          </ul>
        </main>
      </body>
    </>
  );
}
