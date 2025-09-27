import SearchBar from '@/app/components/search_bar';
import styles from './pesquisa_equipamentos.module.css';
import { useState } from 'react';

export default function PesquisaEquipamentosPage() {
  //   const [resultados, setResultados] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    console.log('Buscando por:', query);

    const res = await fetch(``);
    const data = await res.json();

    // setResultados(data);
  };

  return (
    <>
      <div className={styles.bodyContainer}>
        <SearchBar onSearch={handleSearch}></SearchBar>
      </div>
    </>
  );
}
