'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Boxes, ClipboardList, FolderTree, Ticket, Upload, Users } from 'lucide-react';

const links = [
  ['/superadmin/dashboard', 'Panel de control', ClipboardList],
  ['/admin-history', 'Pedidos', ClipboardList],
  ['/superadmin/products', 'Productos', Boxes],
  ['/superadmin/importar-catalogo', 'Carga masiva', Upload],
  ['/superadmin/categories', 'Categorías', FolderTree],
  ['/superadmin/users', 'Usuarios', Users],
  ['/cupons', 'Cupones', Ticket],
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="he-admin-shell">
      <aside className="he-admin-sidebar">
        <Link className="he-admin-brand" href="/superadmin/dashboard">HIERRO <strong>EXPRESS</strong></Link>
        <span>Administración</span>
        <nav>{links.map(([href, label, Icon]) => <Link key={href} href={href}><Icon size={19} aria-hidden="true" />{label}</Link>)}</nav>
      </aside>
      <section className="he-admin-content he-admin-module-content">{children}</section>
    </main>
  );
}
