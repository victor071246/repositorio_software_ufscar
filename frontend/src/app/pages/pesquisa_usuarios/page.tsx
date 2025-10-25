'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'edge';

import { useState } from 'react';
import Header from '@/app/components/header';
import SearchBar from '@/app/components/search_bar';
import styles from './pesquisa_usuarios.module.css';
import { useRouter } from 'next/navigation';

type Usuario = {
  id: number;
  usuario: string;
  nome: string;
  departamento: string;
  admin: boolean;
  supervisor: boolean;
};

export default function PesquisaUsuariosPage() {
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleSearch = async (query: string) => {
    try {
      const res = await fetch(`/api/usuarios?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      const data = await res.json();
      setResultados(data);
      if (data.length === 0) setMensagem('Nenhum usuário encontrado.');
      else setMensagem('');
    } catch (e: unknown) {
      setMensagem(e instanceof Error ? e.message : 'Erro desconhecido');
      setResultados([]);
    }
  };

  return (
    <>
      <div className={styles.body}>
        <Header />
        <main className={styles.main}>
          <h1 className={styles.title}>Pesquisar Funcionários</h1>

          <SearchBar onSearch={handleSearch} />

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}

          <ul className={styles.lista}>
            {resultados.map((u) => (
              <li
                key={u.id}
                className={styles.item}
                onClick={() => router.push(`/pages/visualizar_usuario?id=${u.id}`)}
              >
                <span>{u.id} </span>
                <strong>{u.nome}</strong> ({u.usuario}) - {u.departamento} {u.admin && '[Admin]'}{' '}
                {u.supervisor && '[Supervisor]'}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}
