'use client';
import React, { useState } from 'react';
import styles from './registro_page.module.css';

export default function RegistroPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar_senha, setCofirmar] = useState('');
  const [supervisor, setSupervisor] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault();
    //   setError('');
    //   if (senha !== confirmar_senha) {
    //     setError('As senhas não coincidem');
    //     return;
    //   }
    //   try {
    //       const res = await fetch('/api/registro')
    //   }
    // };
  };
}
