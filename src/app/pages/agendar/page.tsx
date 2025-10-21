'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/header';
import styles from './agendar.module.css';
import { FaTrash } from 'react-icons/fa6';

type Reserva = {
  id: number;
  equipamento_id: number;
  usuario_id: number;
  horario_inicio: string;
  horario_fim: string;
};

export default function AgendarPage() {
  const searchParams = useSearchParams();
  const equipamentoId = searchParams.get('equipamentoId');
  const data = searchParams.get('data');

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // pegar do header/auth
  const [horaInicio, setHoraInicio] = useState<number>(0);
  const [horaFim, setHoraFim] = useState<number>(1);
  const [mensagem, setMensagem] = useState('');

  // Puxar usuário logado do backend/header
  useEffect(() => {
    fetch('/api/usuarios_cookie')
      .then((res) => res.json())
      .then((data) => setUsuarioId(data.id))
      .catch(() => setUsuarioId(null));
  }, []);

  // Puxar reservas existentes do equipamento e data
  useEffect(() => {
    if (!equipamentoId || !data) return;
    const start = `${data} 00:00:00`;
    const end = `${data} 23:59:59`;
    fetch(`/api/reservas?equipamentoId=${equipamentoId}&start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch(() => setReservas([]));
  }, [equipamentoId, data]);

  const horas = Array.from({ length: 24 }, (_, i) => i); // 0–23

  const handleAgendar = async () => {
    if (!equipamentoId || !usuarioId || !data) return;

    // Converter de "DD/MM/YYYY" → "YYYY-MM-DD"
    const [dia, mes, ano] = data.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;

    const inicio = `${dataISO} ${horaInicio.toString().padStart(2, '0')}:00:00`;
    const fim = `${dataISO} ${horaFim.toString().padStart(2, '0')}:00:00`;

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipamento_id: Number(equipamentoId),
          usuario_id: usuarioId,
          inicio,
          fim,
        }),
      });
      const data = await res.json();
      if (res.ok) setMensagem('Agendamento criado com sucesso!');
      else setMensagem(data.error);
    } catch (e) {
      setMensagem('Erro ao criar agendamento.');
    }
  };

  // Função para verificar se a hora está ocupada
  const horaOcupada = (h: number) => {
    return reservas.some((r) => {
      const hi = new Date(r.horario_inicio).getHours();
      const hf = new Date(r.horario_fim).getHours();
      return h >= hi && h < hf;
    });
  };

  const handleLimparAgendamentos = async () => {
    if (!equipamentoId || !data) return;
    const confirm = window.confirm(
      'Tem certeza que deseja limpar todos os agendamentos deste dia?',
    );
    if (!confirm) return;

    const [dia, mes, ano] = data.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;

    try {
      const res = await fetch(`/api/reservas?equipamentoId=${equipamentoId}&data=${dataISO}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (res.ok) {
        setMensagem('Agendamentos removidos com sucesso');
        setReservas([]);
      } else {
        setMensagem(result.error || 'Erro ao limpar agendamentos');
      }
    } catch (e) {
      setMensagem('Erro ao limpar agendamentos');
      console.log(e);
    }
  };

  return (
    <>
      <div className={styles.body}>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerInfo}>
            <h1 className={styles.title}>Agendar equipamento</h1>
            <p>Equipamento: {equipamentoId}</p>
            <p>Data: {data}</p>
          </div>
          <div className={styles.topButtons}>
            <button className={styles.limparButton} onClick={handleLimparAgendamentos}>
              <FaTrash className={styles.trashIcon} /> Limpar agendamentos
            </button>
          </div>
          <div className={styles.horas}>
            <label>
              Hora início:
              <select value={horaInicio} onChange={(e) => setHoraInicio(Number(e.target.value))}>
                {horas.map((h) => (
                  <option key={h} value={h} disabled={horaOcupada(h)}>
                    {h}:00
                  </option>
                ))}
              </select>
            </label>
            <label>
              Hora fim:
              <select value={horaFim} onChange={(e) => setHoraFim(Number(e.target.value))}>
                {horas
                  .filter((h) => h > horaInicio)
                  .map((h) => (
                    <option key={h} value={h} disabled={horaOcupada(h - 1)}>
                      {h}:00
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <button className={styles.agendarButton} onClick={handleAgendar}>
            Agendar
          </button>

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </main>
      </div>
    </>
  );
}
