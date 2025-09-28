'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import styles from './editar_equipamento.module.css';

type Equipamento = {
  id: number;
  nome: string;
  descricao: string;
  estado: 'disponível' | 'indisponível';
};

export default function EditarEquipamentoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const equipamentoId = searchParams.get('equipamentoId');

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!equipamentoId) return;

    fetch(`/api/equipamentos?equipamentoId=${equipamentoId}`)
      .then((res) => res.json())
      .then((data: Equipamento[]) => {
        if (data.length > 0) setEquipamento(data[0]);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar equipamento.');
        setLoading(false);
      });
  }, [equipamentoId]);

  const handleSave = async () => {
    if (!equipamento) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/equipamentos/${equipamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipamento),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || 'Falha ao salvar equipamento');
      }
      router.back();
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!equipamento) return <p>Equipamento não encontrado.</p>;

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Editar Equipamento</h1>
        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>
          Nome
          <input
            type="text"
            value={equipamento.nome}
            onChange={(e) => setEquipamento({ ...equipamento, nome: e.target.value })}
          />
        </label>

        <label className={styles.label}>
          Descrição
          <textarea
            value={equipamento.descricao || ''}
            onChange={(e) => setEquipamento({ ...equipamento, descricao: e.target.value })}
          />
        </label>

        <label className={styles.label}>
          Estado
          <select
            value={equipamento.estado}
            onChange={(e) =>
              setEquipamento({
                ...equipamento,
                estado: e.target.value as 'disponível' | 'indisponível',
              })
            }
          >
            <option value="disponível">Disponível</option>
            <option value="indisponível">Indisponível</option>
          </select>
        </label>

        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </main>
    </>
  );
}
