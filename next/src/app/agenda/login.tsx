'use client';
import React, { useState } from 'react';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
        credentials: 'include', // cookie setado
      });

      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao realizar login');
      }
    } catch (e) {
      setError('Erro de conexão');
      console.log(e);
    }
  };

  return (
    <>
      <div className="login-container"></div>
      <h2>Bem-vindo</h2>
      <form onSubmit={handleSubmit}></form>
      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      ></input>
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      ></input>
      <button type="submit">Entrar</button>
      {error}
    </>

    //reconstruir tela de cadastro e sql do banco
    // cadastrar um usuário admin no banco
    // estabelecer hierarquia de supervisor e admin novamente
    // criar middewares para sueprvisor e admin
    // configurar banco teste ou integrar ao banco que já existe?
  );
}
