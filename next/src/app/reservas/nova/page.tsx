'use client';
import React from 'react';

export default function NovaReserva(){
  const [equipamentos, setEquipamentos] = React.useState<{id:number;nome:string}[]>([]);
  const [usuarios, setUsuarios] = React.useState<{id:number;usuario:string}[]>([]);

  React.useEffect(()=>{ (async()=>{
    const r1 = await fetch('/api/equipamentos'); if(r1.ok) setEquipamentos(await r1.json());
    const r2 = await fetch('/api/usuarios');     if(r2.ok) setUsuarios(await r2.json());
  })(); },[]);

  function toMySQLDateTime(localValue: string) {
  // localValue vem como "YYYY-MM-DDTHH:MM"
  if (!localValue) return '';
  const [d, t] = localValue.split('T');         // "2025-09-23", "03:00"
  const time = t.length === 5 ? `${t}:00` : t;  // garante segundos
  return `${d} ${time}`;                        // "2025-09-23 03:00:00"
    }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const f = e.currentTarget as any;

  const payload = {
    equipamento_id: Number(f.equipamento_id.value),
    usuario_id: Number(f.usuario_id.value),
    inicio: toMySQLDateTime(f.inicio.value),
    fim:    toMySQLDateTime(f.fim.value),
  };

  const r = await fetch('/api/reservas', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if (r.ok) { alert('Reserva criada'); window.location.href = '/agenda'; }
  else { const err = await r.json().catch(()=>({error:'Erro'})); alert(err.error || 'Falha'); }
    }


  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Novo Agendamento</h1>
      <form onSubmit={onSubmit} className="bg-white rounded-xl p-4 shadow grid gap-3">
        <label className="text-sm grid gap-1 text-black">
          <span>Equipamento</span>
          <select name="equipamento_id" required className="border rounded px-3 py-2 bg-gray-900 text-white">
            <option value="">Selecione…</option>
            {equipamentos.map(e=> <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </label>

        <label className="text-sm grid gap-1 text-black text-black">
          <span>Usuário</span>
          <select name="usuario_id" required className="border rounded px-3 py-2 bg-gray-900 text-white">
            <option value="">Selecione…</option>
            {usuarios.map(u=> <option key={u.id} value={u.id}>{u.usuario}</option>)}
          </select>
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm grid gap-1 text-black">
            <span>Início</span>
            <input type="datetime-local" name="inicio" required className="border rounded px-3 py-2 bg-gray-900 text-white"/>
          </label>
          <label className="text-sm grid gap-1 text-black">
            <span>Fim</span>
            <input type="datetime-local" name="fim" required className="border rounded px-3 py-2 bg-gray-900 text-white"/>
          </label>
        </div>

        <div className="flex justify-end gap-2 text-black">
          <a href="/agenda" className="px-4 py-2 border rounded">Cancelar</a>
          <button className="px-4 py-2 rounded bg-black text-white">Salvar</button>
        </div>
      </form>
    </main>
  );
}
