'use client';
import React, { useEffect, useState } from 'react';
import { fetchAttributes } from '@/helpers/peticionesSuperAdmin';
import { Attribute } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { FiEdit } from 'react-icons/fi';
import BackButton from '../ProductIdComponents/BackButton';
import { AiOutlineSearch } from 'react-icons/ai';

const PAGE_SIZE = 10;

const AttributeList: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(attributes.length / PAGE_SIZE));
  }, [attributes]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const attributesData = await fetchAttributes();
      setAttributes(attributesData);
    } catch (error) {
      console.error('Error al obtener los atributos', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const filteredAttributes = attributes.filter((attribute) =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-300 text-xl">Cargando...</div>
        </div>
      </div>
    );
  }
  if (attributes.length === 0) return <div>No hay atributos disponibles.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 w-full flex-1">
        <div className="flex justify-between items-center mb-4">
          <BackButton className="mr-4" />
          <h2 className="text-2xl font-bold text-red-500">Atributos</h2>
          {isSuperAdmin() && (
            <Link href="/superadmin/attributes/create">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Crear Atributo
              </button>
            </Link>
          )}
        </div>
        <div className="flex items-center mb-4 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar atributos..."
            className="border-gray-300 rounded-full border p-2 pl-10 focus:border-red-500 w-full"
          />
          <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        {filteredAttributes.length === 0 && !loading && (
          <div className="text-center text-gray-500 my-4">
            No hay atributos que coincidan con la búsqueda.
          </div>
        )}
        {filteredAttributes.length > 0 && (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wider">
                  Atributo
                </th>
                <th className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wide">
                  Unidades
                </th>
                <th className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wide">
                  Gestión
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributes
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((attribute, index) => (
                  <tr key={attribute.id}>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      {attribute.name}
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      {attribute.units}
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      <button className="bg-white text-green-500 px-2 py-1 rounded mr-2">
                        <Link
                          href={`/superadmin/attributes/edit/${attribute.id}`}
                        >
                          <FiEdit className="text-4xl" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded mr-2"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded mr-2"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AttributeList;
