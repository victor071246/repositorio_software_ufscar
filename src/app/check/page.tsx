'use client';
import React from 'react';


type Equip = { id:number; nome:string; descricao:string; estado:string; departamento_id:number|null; criado_em:string };


export default function CheckPage(){
const [ping, setPing] = React.useState<string>('…');
const [list, setList] = React.useState<Equip[]>([]);
const [err, setErr] = React.useState<string>('');


React.useEffect(()=>{ (async()=>{
try {
const r1 = await fetch('/api/ping');
const j1 = await r1.json();
setPing(j1.ok ? 'DB OK' : 'DB ERRO');
} catch (e:any) { setPing('DB ERRO'); }


try {
const r2 = await fetch('/api/equipamentos');
if(!r2.ok) throw new Error('Falha em /api/equipamentos');
setList(await r2.json());
} catch (e:any) { setErr(String(e?.message||e)); }
})(); },[]);


return (
<main className="max-w-4xl mx-auto p-4 space-y-4">
<h1 className="text-xl font-semibold">Check — Conexão & Equipamentos</h1>
<div className="bg-white rounded-xl p-4 shadow text-sm">
<div><span className="font-medium">Banco:</span> {ping}</div>
{err && <div className="text-red-600">Erro: {err}</div>}
</div>


<div className="bg-white rounded-xl p-4 shadow">
<h2 className="font-medium mb-2">Equipamentos</h2>
{list.length===0 ? (
<div className="text-sm text-gray-500">Nenhum equipamento retornado.</div>
) : (
<ul className="divide-y">
{list.map(e => (
<li key={e.id} className="py-2 text-sm">
<div className="font-medium">{e.nome}</div>
<div className="text-gray-600">{e.descricao}</div>
<div className="text-gray-500">Estado: {e.estado} • DepID: {e.departamento_id ?? '—'}</div>
</li>
))}
</ul>
)}
</div>
</main>
);
}