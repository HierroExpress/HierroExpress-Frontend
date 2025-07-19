'use client'
import React, {useEffect, useState} from 'react';
import AttributeForm from './attributeForm';
import { updateAttribute, getAttributeById } from '@/helpers/peticionesSuperAdmin';
import { Attribute } from '@/types';
import ConfirmModal from '../SuperAdminProducts/confirmModal';
import BackButton from '../ProductIdComponents/BackButton';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'react-toastify';
import  {useRouter} from 'next/navigation';

interface AttributeEditProps {
  attributeId: string;
}

const AttributeEdit: React.FC<AttributeEditProps> = ({attributeId}) => {
  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const {accessToken} = useAuth();

  useEffect(() => {
    if(!accessToken) {
      console.error('No se encontró el token de autenticación.');
      return;
    }
    const fetchAttribute = async () =>{
      try{
          setLoading(true)
          const attributeData = await getAttributeById(attributeId, accessToken);
          console.log('Datos del atributo cargado:', attributeData);
          setAttribute(attributeData);
      }catch (error) {
        console.error('Error al obtener el atributo', error);
        setError('No se pudo obtener el atributo. Por favor, inténtalo nuevamente.');
      }finally {
        setLoading(false);
      }
    };

    fetchAttribute();
  }, [attributeId, accessToken]);

  const handleUpdate = (data: Attribute) => {
    console.log('Data recibida:', data);
    setUpdateData(data);
    setModalOpen(true);
  };

  const confirmUpdate = async () => {
    if (!updateData || !accessToken) return;
    
    try {
      await updateAttribute(attributeId, updateData, accessToken);
      toast.success('Atributo actualizado exitosamente', {
        position: 'top-center',
        autoClose: 3000,
      });
      router.push('/superadmin/attributes');
    } catch (error) {
      console.error('Error al actualizar el atributo', error);
      toast.error('Error al actualizar el atributo', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setModalOpen(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setUpdateData(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Cargando atributo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!attribute) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">No se encontró el atributo</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <BackButton className="mr-4" />
        <h1 className="text-2xl font-bold">Editar Atributo</h1>
      </div>
      
      <AttributeForm
        defaultValues={attribute}
        onSubmit={handleUpdate}
        isEditMode={true}
      />
      
      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmUpdate}
        onCancel={closeModal}
        title="Confirmar actualización"
        message="¿Estás seguro de que quieres actualizar este atributo?"
      />
    </div>
  );
};

export default AttributeEdit;