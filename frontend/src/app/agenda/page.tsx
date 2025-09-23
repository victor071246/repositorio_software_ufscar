'use client';
import React from 'react';

type Equip = { id:number; nome:string };
type Reserva = {
  id:number;
  equipamento_id:number;
  usuario_id:number;
  horario_inicio:string;
  horario_fim:string;
  responsavel:string;
  equipamento_nome:string;
};

export default function AgendaPage(){
  const [eqs, setEqs]   = React.useState<Equip[]>([]);
  const [eqId, setEqId] = React.useState<number|''>('');
  const [start, setStart] = React.useState<string>(new Date().toISOString().slice(0,10));
  const [end, setEnd]     = React.useState<string>(new Date(Date.now()+7*86400000).toISOString().slice(0,10));
  const [list, setList] = React.useState<Reserva[]>([]);

  React.useEffect(()=>{ (async()=>{
    const r = await fetch('/api/equipamentos');
    if(r.ok) setEqs(await r.json());
  })(); },[]);

  React.useEffect(()=>{ (async()=>{
    const p = new URLSearchParams();
    if(eqId!=='') p.set('equipamentoId', String(eqId));
    if(start) p.set('start', start);
    if(end)   p.set('end', end);
    const r = await fetch('/api/reservas?'+p.toString());
    if(r.ok) setList(await r.json());
  })(); },[eqId,start,end]);

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-white">Agenda (leitura)</h1>

      <div className="bg-white text-black rounded-xl p-4 shadow grid md:grid-cols-4 gap-3">
        <label className="text-sm grid gap-1">
          <span>Equipamento</span>
          <select className="border rounded px-3 py-2 bg-white text-black"
                  value={eqId as any}
                  onChange={e=>setEqId(e.target.value?Number(e.target.value):'')}>
            <option value="">Todos</option>
            {eqs.map(e=> <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </label>
        <label className="text-sm grid gap-1">
          <span>Início</span>
          <input type="date" className="border rounded px-3 py-2 bg-white text-black"
                 value={start} onChange={e=>setStart(e.target.value)} />
        </label>
        <label className="text-sm grid gap-1">
          <span>Fim</span>
          <input type="date" className="border rounded px-3 py-2 bg-white text-black"
                 value={end} onChange={e=>setEnd(e.target.value)} />
        </label>
        <div className="flex items-end">
          <a className="px-4 py-2 rounded border" href="/reservas/nova">Novo agendamento</a>
        </div>
      </div>

      <div className="bg-white text-black rounded-xl p-4 shadow">
        <h2 className="font-medium mb-3">Reservas</h2>
        <div className="grid gap-2">
          {list.length===0 && <div className="text-sm text-gray-600">Sem reservas no período.</div>}
          {list.map(r=>(
            <div key={r.id} className="border rounded-lg p-3 text-sm flex justify-between">
              <div>
                <div><span className="font-medium">Equipamento:</span> {r.equipamento_nome} (#{r.equipamento_id})</div>
                <div><span className="font-medium">Quando:</span> {fmt(r.horario_inicio)} → {fmt(r.horario_fim)}</div>
                <div><span className="font-medium">Responsável:</span> {r.responsavel} (#{r.usuario_id})</div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 self-start">ATIVA</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function fmt(iso:string){ return new Date(iso).toLocaleString(); }
