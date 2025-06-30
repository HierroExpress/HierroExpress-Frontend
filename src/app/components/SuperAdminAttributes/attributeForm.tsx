'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

type AttributeFormProps = {
  defaultValues?: any;
  onSubmit: (data: any) => void;
  isEditMode?: boolean;
};

const AttributeForm: React.FC<AttributeFormProps> = ({
  defaultValues,
  onSubmit,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  const handleSubmitForm = (data: any) => {
    try {
      onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    }
  };

  return (
    <div className="items-center min-h-screen">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-1 gap-4 p-4 bg-white shadow-lg rounded-xl max-w-2xl mx-auto"
      >
        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Nombre</label>
          <input
            {...register('name', { required: 'El nombre es requerido' })}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.name && (
            <div className="text-red-500">Nombre invalido</div>
          )}
        </div>

        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Unidades</label>
          <input
            {...register('units', { required: 'Las unidades son requeridas' })}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.units && (
            <div className="text-red-500">Unidades invalido</div>
          )}
        </div>

        <div className="col-span-1 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-600"
          >
            {isEditMode ? 'Actualizar Atributo' : 'Crear Atributo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttributeForm;
