'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';
import RouteGuard from '@/helpers/routeGuard';
import { useAuth } from '@/app/contexts/AuthContext';

function CatalogImport() {
  const { accessToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [imageStatus, setImageStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setStatus('');
  };

  const chooseImages = (event: ChangeEvent<HTMLInputElement>) => {
    setImages(Array.from(event.target.files || []));
    setImageStatus('');
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

  const uploadImages = async () => {
    if (!images.length || !accessToken) return;
    setUploadingImages(true);
    setImageStatus('Cargando y vinculando imágenes…');
    try {
      const body = new FormData();
      images.forEach((image) => body.append('images', image));
      const response = await fetch('/api/seeders/catalog-images', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(Array.isArray(data.message) ? data.message.join('. ') : data.message || 'No se pudieron cargar las imágenes.');
      const pending = data.unmatched?.length ? ` No se encontraron productos para: ${data.unmatched.join(', ')}.` : '';
      setImageStatus(`${data.message}${pending}`);
    } catch (error) {
      setImageStatus(error instanceof Error ? error.message : 'No se pudieron cargar las imágenes.');
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <main className="he-admin-page">
      <header className="he-admin-heading">
        <div>
          <p className="he-eyebrow">CATÁLOGO</p>
          <h1>Carga masiva de productos</h1>
          <p>Importa el catálogo con nombres claros: no necesitas IDs ni códigos internos.</p>
        </div>
        <Link className="he-text-link" href="/superadmin/products">Volver a productos</Link>
      </header>

      <section className="he-cart-box">
        <h2>1. Descarga la plantilla</h2>
        <p>Escribe nombres de categorías, subcategorías y atributos. El sistema crea las relaciones automáticamente.</p>
        <a className="he-button he-button-outline" href="/plantilla-catalogo-hierroexpress.xlsx" download>
          Descargar plantilla Excel
        </a>
      </section>

      <section className="he-cart-box">
        <h2>2. Importa el archivo completo</h2>
        <p>Las hojas <strong>CATEGORIAS</strong> y <strong>PRODUCTOS</strong> son obligatorias. Escribe los nombres tal como quieres verlos en la tienda.</p>
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

      <section className="he-cart-box">
        <h2>3. Agrega las fotos</h2>
        <p>Selecciona todas las fotos de una vez. Para vincularlas automáticamente, nombra cada archivo como el producto: por ejemplo, <strong>CANO-CUADRADO-20X20.jpg</strong> se vincula con “CAÑO CUADRADO 20 X 20”.</p>
        <label htmlFor="catalog-images">
          Fotos de productos
          <input id="catalog-images" type="file" accept="image/*" multiple onChange={chooseImages} />
        </label>
        {images.length > 0 && <p>{images.length} foto{images.length === 1 ? '' : 's'} seleccionada{images.length === 1 ? '' : 's'}.</p>}
        <button className="he-button he-button-orange" type="button" onClick={uploadImages} disabled={!images.length || uploadingImages}>
          {uploadingImages ? 'Cargando fotos…' : 'Cargar y vincular fotos'}
        </button>
        {imageStatus && <p role="status" className={imageStatus.includes('correctamente') ? 'he-import-success' : imageStatus.startsWith('Cargando') ? '' : 'he-form-error'}>{imageStatus}</p>}
      </section>
    </main>
  );
}

export default function CatalogImportPage() {
  return <RouteGuard allowedRoles={['superadmin']}><CatalogImport /></RouteGuard>;
}
