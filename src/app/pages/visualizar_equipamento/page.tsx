'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/app/components/header';
import styles from './visualizar_equipamentos.module.css';

type Reserva = {
  id: number;
  equipamento_id: number;
  usuario_id: number;
  horario_inicio: string;
  horario_fim: string;
  responsavel: string;
};

type Equipamento = {
  id: number;
  nome: string;
  descricao: string;
  estado: 'disponível' | 'indisponível';
};

export default function VisualizacaoHorarioPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const equipamentoId = searchParams.get('equipamentoId');

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [reservas, setReservas] = useState<Reserva[]>([]);

  // Carregar equipamento
  useEffect(() => {
    if (!equipamentoId) return;
    fetch(`/api/equipamentos?equipamentoId=${equipamentoId}`)
      .then((res) => res.json())
      .then((data) => setEquipamento(data[0] || null));
  }, [equipamentoId]);

  // Carregar reservas da semana
  useEffect(() => {
    if (!equipamentoId) return;
    const start = formatDate(currentWeekStart);
    const end = formatDate(new Date(currentWeekStart.getTime() + 6 * 86400000));
    fetch(`/api/reservas?equipamentoId=${equipamentoId}&start=${start}&end=${end}`)
      .then((res) => res.json())
      .then((data) => setReservas(data));
  }, [equipamentoId, currentWeekStart]);

  const nextWeek = () => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 86400000));
  const prevWeek = () => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 86400000));

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0h–23h

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart.getTime() + i * 86400000);
    return {
      date: d,
      reservas: reservas.filter((r) => {
        const hi = new Date(r.horario_inicio);
        const hf = new Date(r.horario_fim);
        return hi.toDateString() === d.toDateString() || hf.toDateString() === d.toDateString();
      }),
    };
  });

  const handleAgendar = (date: Date) => {
    if (!equipamentoId) return;
    router.push(`/pages/agendar?equipamentoId=${equipamentoId}&data=${formatDate(date)}`);
  };

  const handleIntercorrencia = () => {
    if (!equipamentoId) return;
    router.push(`/pages/intercorrencias?equipamentoId=${equipamentoId}`);
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        {equipamento && (
          <div className={styles.equipamentoInfo}>
            <h1>{equipamento.nome}</h1>
            <p>{equipamento.descricao}</p>
            <p>
              <strong>Status:</strong>{' '}
              {equipamento.estado === 'disponível' ? 'Disponível' : 'Indisponível'}
            </p>
            {/* Botão de editar */}
            <button
              className={styles.editButton}
              onClick={() =>
                router.push(`/pages/editar_equipamento?equipamentoId=${equipamento.id}/`)
              }
            >
              Editar equipamento
            </button>
            {/* Botão de intercorrências */}
            <button className={styles.intercorrenciaButton} onClick={handleIntercorrencia}>
              Ver intercorrências
            </button>
          </div>
        )}

        <div className={styles.navigation}>
          <button onClick={prevWeek}>&lt; Semana</button>
          <span>
            {formatDate(currentWeekStart)} -{' '}
            {formatDate(new Date(currentWeekStart.getTime() + 6 * 86400000))}
          </span>
          <button onClick={nextWeek}>Semana &gt;</button>
        </div>

        <div className={styles.grid}>
          {days.map((day, i) => (
            <div key={i} className={styles.tile}>
              <div className={styles.date}>{day.date.toDateString()}</div>
              <div className={styles.hours}>
                {hours.map((hour) => {
                  const isBooked = day.reservas.some((r) => {
                    const hi = new Date(r.horario_inicio).getHours();
                    const hf = new Date(r.horario_fim).getHours();
                    return hour >= hi && hour < hf;
                  });
                  return (
                    <div key={hour} className={isBooked ? styles.booked : styles.free}>
                      {hour}:00
                    </div>
                  );
                })}
              </div>
              <button className={styles.agendarButton} onClick={() => handleAgendar(day.date)}>
                Agendar
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

// Helpers
function getMonday(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when Sunday
  return new Date(d.setDate(diff));
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}
