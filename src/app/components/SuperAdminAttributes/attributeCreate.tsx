'use client';
import React, { useState } from 'react';
import { createAttribute } from '@/helpers/peticionesSuperAdmin'; // Assuming this exists
import BackButton from '../ProductIdComponents/BackButton';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AttributeForm from './attributeForm';
import ConfirmModal from '../SuperAdminProducts/confirmModal';

interface AttributeData {
  name: string;
  units: string;
}

const AttributeCreate: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<AttributeData>({
    name: '',
    units: '',
  });
  const { accessToken } = useAuth();
  const token = accessToken;
  const [modalAction, setModalAction] = useState<() => void>(() => {});

  const handleCreate = async (data: AttributeData) => {
    try {
      if (!token) {
        throw new Error('Token no disponible');
      }

      setModalAction(() => async () => {
        const response = await createAttribute(data, token); // Assuming createAttribute is defined
        console.log(response);

        if (response.success) {
          setError(null);
          setFormData({ name: '', units: '' });
          toast.success('Atributo creado exitosamente', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          router.push('/superadmin/attributes'); // Adjust the route as needed
        } else {
          setError(response.data || 'Error al crear el atributo');
          toast.error(response.data || 'Error al crear el atributo', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
      setModalOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setError('Error al crear el atributo. Inténtalo de nuevo más tarde.');
        toast.error(
          'Error al crear el atributo. Inténtalo de nuevo más tarde.',
          {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          },
        );
      }
    }
  };

  const handleConfirm = () => {
    setModalOpen(false);
    modalAction();
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-2xl p-4">
        <div className="flex items-center justify-start mb-4">
          <BackButton />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <AttributeForm onSubmit={handleCreate} defaultValues={formData} />
        <ConfirmModal
          isOpen={isModalOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Confirmar creación de atributo"
          message="¿Estás seguro de que deseas crear este atributo?"
        />
      </div>
    </div>
  );
};

export default AttributeCreate;
