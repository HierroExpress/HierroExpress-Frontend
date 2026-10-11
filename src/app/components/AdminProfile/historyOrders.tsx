'use client';
import { getCookie } from 'cookies-next';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { OrderDetailModal } from './detailOrderAdmin';
import Select from './select';
import { SearchBar } from './search';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Product {
  name: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  price: string;
  date: string;
  email: string;
  formBuy: string;
  paymentStatus: 'Pagado' | 'Pendiente de pago';
  orderInstructions: string;
  address?: { address?: string; localidad?: string } | null;
  status:
    | 'En camino'
    | 'Pendiente'
    | 'En preparación'
    | 'Entregada'
    | 'Confirmada';
  products: Product[];
}

const ITEMS_PER_PAGE = 5;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA');
};

const escapeHtml = (value: string | number | undefined | null) =>
  String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] || character);

export function HistoryOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false); // Estado para manejar sin resultados
  const queryClient = useQueryClient();

  const statusOptions = [
    { value: 'En camino', label: 'En camino' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'En preparación', label: 'En preparación' },
    { value: 'Entregada', label: 'Entregada' },
    { value: 'Confirmada', label: 'Confirmada' },
  ];

  const handleSelectChange = (value: string) => {
    const filtered = orders.filter((order) => order.status === value);
    setFilteredOrders(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleStatusEditChange = async (value: string, id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/update`, {
      method: 'PUT',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('accessToken') || ''}`,
      },
      body: JSON.stringify({
        id: parseInt(id),
        status: value,
      }),
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      })
      .catch((e) => console.error(e));
  };

  const detailOrderAdmin = (orderId: string) => {
    const order = orders.find((order) => order.id === orderId);
    setSelectedOrder(order || null);
  };

  const printOrder = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=820,height=720');
    if (!printWindow) return;
    const products = order.products.map((product) => `
      <tr><td>${escapeHtml(product.name)}</td><td>${escapeHtml(product.quantity)}</td><td>${escapeHtml(product.price)}</td></tr>`).join('');
    const deliveryAddress = [order.address?.address, order.address?.localidad].filter(Boolean).join(', ') || 'A coordinar';
    printWindow.document.write(`<!doctype html><html lang="es"><head><title>Pedido #${escapeHtml(order.id)}</title><style>body{font-family:Arial,sans-serif;color:#102f46;margin:36px}header{border-bottom:3px solid #f49b22;padding-bottom:18px;margin-bottom:24px}h1{margin:0;font-size:28px}.label{font-size:12px;text-transform:uppercase;color:#50738d;letter-spacing:.06em}.status{display:inline-block;padding:7px 11px;font-weight:bold;border-radius:4px;background:${order.paymentStatus === 'Pagado' ? '#e6f4ea' : '#fff3e2'};color:${order.paymentStatus === 'Pagado' ? '#24713c' : '#9a5b00'}}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:11px;border-bottom:1px solid #cfdde8;text-align:left}th{background:#eaf3f9}.total{font-size:21px;font-weight:bold;text-align:right;margin-top:24px}@media print{body{margin:20px}}</style></head><body><header><div class="label">Hierro Express · Orden de preparación</div><h1>Pedido #${escapeHtml(order.id)}</h1></header><p><strong>Fecha:</strong> ${escapeHtml(formatDate(order.date))}</p><p><strong>Cliente:</strong> ${escapeHtml(order.email)}</p><p><strong>Entrega:</strong> ${escapeHtml(deliveryAddress)}</p><p><strong>Forma de pago:</strong> ${escapeHtml(order.formBuy === 'mercadopago' ? 'Mercado Pago' : 'A coordinar')}</p><p><strong>Estado de pago:</strong> <span class="status">${escapeHtml(order.paymentStatus)}</span></p><table><thead><tr><th>Producto</th><th>Cantidad</th><th>Importe</th></tr></thead><tbody>${products}</tbody></table><p class="total">Total: ${escapeHtml(order.price)}</p>${order.orderInstructions ? `<p><strong>Indicaciones:</strong> ${escapeHtml(order.orderInstructions)}</p>` : ''}<script>window.onload=()=>window.print()<\/script></body></html>`);
    printWindow.document.close();
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'En camino':
        return 'text-blue-500';
      case 'Pendiente':
        return 'text-yellow-500';
      case 'En preparación':
        return 'text-orange-500';
      case 'Entregada':
        return 'text-green-500';
      default:
        return '';
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/all-orders?page=${currentPage}&limit=${ITEMS_PER_PAGE}&email=${searchQuery}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getCookie('accessToken') || ''}`,
          },
        },
      ).then((res) => res.json());

      console.log('esto llega', response);
      return response;
    },
    queryKey: ['orders', currentPage, searchQuery],

    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
      setFilteredOrders(data.orders);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      setNoResults(data.orders.length === 0);
    }
  }, [data]);

  if (isLoading) return <div className="min-h-screen">Cargando órdenes...</div>;
  if (isError)
    return (
      <div className="min-h-screen">Hubo un error, intenta nuevamente</div>
    );

  const pending = orders.filter((order) => order.status === 'Pendiente').length;
  return (
    <main className="he-admin-page">
      <header className="he-admin-heading">
        <div><p className="he-eyebrow">PANEL DE PEDIDOS</p><h1>Órdenes</h1><p>Revisá y actualizá cada pedido desde un solo lugar.</p></div>
        <div className="he-admin-stat"><strong>{pending}</strong><span>pendientes</span></div>
      </header>
      <section className="he-admin-controls">
        <div>
          <Select
            options={statusOptions}
            onChange={handleSelectChange}
            placeholder="Selecciona un estado"
          />
        </div>
        <div>
          <SearchBar onSearch={handleSearch} searchValue={searchQuery} />
        </div>
      </section>
      <section className="he-admin-table-wrap">
        {noResults ? (
          <div className="text-red-600 text-center my-4">
            <pre>
              {' '}
              No se han encontrado resultados para tu búsqueda. Asegúrate de que
              todas las palabras estén escritas correctamente.
            </pre>
          </div>
        ) : (
          <Table className="min-w-full he-admin-table">
            <TableCaption>Pedidos recibidos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead className="text-right">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell className={getStatusStyle(order.status)}>
                    <Select
                      options={statusOptions}
                      onChange={(e) => handleStatusEditChange(e, order.id)}
                      placeholder={order.status}
                    />
                  </TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell><span className={order.paymentStatus === 'Pagado' ? 'he-payment-paid' : 'he-payment-pending'}>{order.paymentStatus}</span></TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell className="text-right">
                    {order?.products?.length > 0 && (
                      <div className="flex justify-end gap-2"><Button className="bg-blue-600 hover:bg-gray-500" onClick={() => detailOrderAdmin(order.id)}>Ver detalle</Button><Button className="bg-slate-700 hover:bg-slate-600" onClick={() => printOrder(order)}>Imprimir</Button></div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="he-admin-pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                ) : (
                  <button disabled>Anterior</button>
                )}
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => {
                if (currentPage - 3 <= index && index < currentPage + 2)
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        className={
                          index + 1 === currentPage
                            ? 'bg-blue-600 text-white'
                            : ''
                        }
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                return null;
              })}
              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                ) : (
                  <button disabled>Siguiente</button>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
    </main>
  );
}
