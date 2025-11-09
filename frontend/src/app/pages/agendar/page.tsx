'use client';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

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
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [horaInicio, setHoraInicio] = useState<number>(0);
  const [horaFim, setHoraFim] = useState<number>(1);
  const [mensagem, setMensagem] = useState('');

  // 🔹 Carrega usuário logado
  useEffect(() => {
    fetch('/api/usuarios_cookie')
      .then((res) => res.json())
      .then((data) => {
        console.log('📥 Usuário logado:', data);
        setUsuarioId(data.id);
      })
      .catch((e) => {
        console.error('⚠️ Erro ao carregar usuário:', e);
        setUsuarioId(null);
      });
  }, []);

  // 🔹 Busca reservas do dia
  async function carregarReservas() {
    if (!equipamentoId || !data) return;

    let dataISO = data.includes('/')
      ? data.split('/').reverse().join('-')
      : data;

    const start = `${dataISO} 00:00:00`;
    const end = `${dataISO} 23:59:59`;

    try {
      const res = await fetch(
        `/api/reservas?equipamentoId=${equipamentoId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
      );
      const json = await res.json();
      console.log('📦 Reservas recebidas:', json);
      setReservas(json);
    } catch (e) {
      console.error('⚠️ Erro ao buscar reservas:', e);
      setReservas([]);
    }
  }

  useEffect(() => {
    carregarReservas();
  }, [equipamentoId, data]);

  const horas = Array.from({ length: 24 }, (_, i) => i);

  // 🕒 Criar agendamento
  const handleAgendar = async () => {
    console.log('🟡 Clique em "Agendar" detectado');

    if (!equipamentoId || !usuarioId || !data) {
      console.warn('⚠️ Dados insuficientes:', { equipamentoId, usuarioId, data });
      setMensagem('Erro: dados incompletos');
      return;
    }

    // 🔧 Lê valores diretamente dos selects (sem depender do estado React)
    const inicioSelect = document.querySelector('select[name="inicio"]') as HTMLSelectElement | null;
    const fimSelect = document.querySelector('select[name="fim"]') as HTMLSelectElement | null;

    const hi = inicioSelect ? Number(inicioSelect.value) : horaInicio;
    const hf = fimSelect ? Number(fimSelect.value) : horaFim;

    console.log('🧭 Horários capturados:', { hi, hf });

    if (isNaN(hi) || isNaN(hf)) {
      console.error('⚠️ Hora inválida detectada:', { hi, hf });
      setMensagem('Selecione horários válidos.');
      return;
    }

    // ✅ Agora compara corretamente
    if (hf <= hi) {
      console.error('❌ Validação front: horário final <= inicial', { hi, hf });
      setMensagem('O horário final deve ser maior que o inicial');
      return;
    }

    const dataISO = data.includes('/')
      ? data.split('/').reverse().join('-')
      : data;

    const inicio = `${dataISO} ${hi.toString().padStart(2, '0')}:00:00`;
    const fim = `${dataISO} ${hf.toString().padStart(2, '0')}:00:00`;

    console.log('📤 Enviando tentativa de agendamento:', {
      equipamento_id: Number(equipamentoId),
      usuario_id: usuarioId,
      inicio,
      fim,
    });

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

      const json = await res.json();
      console.log('📥 Resposta backend:', json);

      if (res.ok) {
        setMensagem('✅ Agendamento criado com sucesso!');
        await carregarReservas();
      } else {
        setMensagem(`❌ Erro: ${json.error || 'Falha ao criar agendamento'}`);
      }
    } catch (e) {
      console.error('💥 Erro de rede:', e);
      setMensagem('Erro ao criar agendamento.');
    }
  };

  // 🔹 Marca hora ocupada (sem UTC)
  const horaOcupada = (h: number) =>
    reservas.some((r) => {
      const hi = Number(r.horario_inicio.split(' ')[1]?.split(':')[0]);
      const hf = Number(r.horario_fim.split(' ')[1]?.split(':')[0]);
      return h >= hi && h < hf;
    });

  // 🔹 Limpar agendamentos
  const handleLimparAgendamentos = async () => {
    if (!equipamentoId || !data) return;
    if (!window.confirm('Tem certeza que deseja limpar todos os agendamentos deste dia?')) return;

    const dataISO = data.includes('/')
      ? data.split('/').reverse().join('-')
      : data;

    try {
      const res = await fetch(`/api/reservas?equipamentoId=${equipamentoId}&data=${dataISO}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      console.log('🗑️ Resposta delete:', result);

      if (res.ok) {
        setMensagem('🧹 Agendamentos removidos com sucesso');
        setReservas([]);
      } else {
        setMensagem(result.error || 'Erro ao limpar agendamentos');
      }
    } catch (e) {
      console.error('💥 Erro ao limpar agendamentos:', e);
      setMensagem('Erro ao limpar agendamentos');
    }
  };

  return (
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
            <select
              name="inicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(Number(e.target.value))}
            >
              {horas.map((h) => (
                <option key={h} value={h} disabled={horaOcupada(h)}>
                  {h}:00
                </option>
              ))}
            </select>
          </label>

          <label>
            Hora fim:
            <select
              name="fim"
              value={horaFim}
              onChange={(e) => setHoraFim(Number(e.target.value))}
            >
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
  );
}
