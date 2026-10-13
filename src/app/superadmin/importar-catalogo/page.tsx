'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import RouteGuard from '@/helpers/routeGuard';
import { useAuth } from '@/app/contexts/AuthContext';

function CatalogImport() {
  const { accessToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setStatus('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !accessToken) return;
    setBusy(true);
    setStatus('Importando categorías, atributos y productos…');
    try {
      const body = new FormData();
      body.append('catalog', file);
      const response = await fetch('/api/seeders/catalog', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join('. ') : data.message || 'No se pudo importar el archivo.');
      }
      setStatus(data.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo importar el archivo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="he-admin-page">
      <header className="he-admin-heading">
        <div>
          <p className="he-eyebrow">CATÁLOGO</p>
          <h1>Carga masiva de productos</h1>
          <p>Importa categorías, atributos y productos desde un único archivo Excel.</p>
        </div>
        <Link className="he-text-link" href="/superadmin/products">Volver a productos</Link>
      </header>

      <section className="he-cart-box">
        <h2>1. Descarga la plantilla</h2>
        <p>Incluye las hojas y columnas que reconoce el sistema, con ejemplos para completar o reemplazar.</p>
        <a className="he-button he-button-outline" href="/plantilla-catalogo-hierroexpress.xlsx" download>
          Descargar plantilla Excel
        </a>
      </section>

      <section className="he-cart-box">
        <h2>2. Importa el archivo completo</h2>
        <p>Las hojas <strong>CATEGORIAS</strong> y <strong>PRODUCTOS</strong> son obligatorias. <strong>ATRIBUTOS</strong> y <strong>Subcategorias</strong> son opcionales.</p>
        <p>Los productos ya existentes no se duplican.</p>
        <form className="he-guest-form" onSubmit={submit}>
          <label htmlFor="catalog-file">
            Archivo de catálogo
            <input id="catalog-file" type="file" accept=".xlsx,.xls" required onChange={chooseFile} />
          </label>
          {file && <p>Archivo seleccionado: <strong>{file.name}</strong></p>}
          <button className="he-button he-button-orange" type="submit" disabled={!file || busy}>
            {busy ? 'Importando catálogo…' : 'Importar catálogo'}
          </button>
        </form>
        {status && <p role="status" className={status.includes('correctamente') ? 'he-import-success' : 'he-form-error'}>{status}</p>}
      </section>
    </main>
  );
}

export default function CatalogImportPage() {
  return <RouteGuard allowedRoles={['superadmin']}><CatalogImport /></RouteGuard>;
}
