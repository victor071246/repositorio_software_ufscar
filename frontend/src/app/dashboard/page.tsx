import Header from '@/app/components/header';
import styles from './dashboard.module.css';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <Header></Header>
      <main className={styles.content}>
        <Link href="/pages/pesquisa_equipamentos" className={styles.block}>
          <h2>Equipamentos</h2>
          <p>Visualizar ou selecionar equipamento</p>
        </Link>

        <Link href="/dashboard/usuarios" className={styles.block}>
          <h2>Pesquisadores</h2>
          <p>Buscar e gerenciar usuários</p>
        </Link>

        <Link href="/pages/cadastro_equipamentos" className={styles.block}>
          <h2>Novo Equipamento</h2>
          <p>Cadastrar um novo equipamento</p>
        </Link>

        <Link href="/dashboard/agendar" className={styles.block}>
          <h2>Intercorrências</h2>
          <p>Visualizar intercorrências</p>
        </Link>
      </main>
    </div>
  );
}
