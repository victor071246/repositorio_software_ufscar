'use client';

import { Suspense } from 'react';
import VisualizarUsuarioComponent from './visualizar_usuario_component';

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <VisualizarUsuarioComponent />
    </Suspense>
  );
}
