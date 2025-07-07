'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const CategoryData = z.object({
  name: z
    .string()
    .min(1, 'Nombre es requerido')
    .max(50, 'El nombre debe tener como máximo 50 caracteres'),
  icon: z.any().optional(),
});

type CategoryFormProps = {
  defaultValues?: any;
  onSubmit: (data: any, icon?: string) => void;
  isEditMode?: boolean;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  defaultValues,
  onSubmit,
  isEditMode,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(CategoryData),
    defaultValues,
  });

  const [iconPreview, setIconPreview] = useState<string | null>(
    defaultValues?.icon || null,
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [uploadedIconUrl, setUploadedIconUrl] = useState<string | null>(
    defaultValues?.icon || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValues?.icon) {
      setIconPreview(defaultValues.icon);
      setUploadedIconUrl(defaultValues.icon);
    }
  }, [defaultValues]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Limpiar la URL anterior si se selecciona un nuevo archivo
      setUploadedIconUrl(null);
    }
  };

  const handleIconUpload = async () => {
    if (iconFile) {
      const formData = new FormData();
      formData.append('image', iconFile);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(
            `Error al subir la imagen al backend: ${errorResponse.message}`,
          );
        }

        const data = await response.json();
        console.log('Respuesta del backend:', data);
        const iconUrl = data.secure_url;
        setUploadedIconUrl(iconUrl);
        return iconUrl;
      } catch (error) {
        console.error('Error al subir la imagen al backend', error);
        throw error;
      }
    }
    return uploadedIconUrl; // Retornar la URL existente si no hay archivo nuevo
  };

  const handleSubmitForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Subir el icono si hay un archivo nuevo, o usar el existente
      const iconUrl = await handleIconUpload();
      
      // Enviar los datos con la URL del icono
      await onSubmit(data, iconUrl);
      
      // Solo hacer reset si no estamos en modo edición
      if (!isEditMode) {
        reset();
        setIconPreview(null);
        setIconFile(null);
        setUploadedIconUrl(null);
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="items-center min-h-screen">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white shadow-lg rounded-xl max-w-4xl mx-auto"
      >
        <div className="col-span-1 md:col-span-2 mb-4">
          {iconPreview && (
            <img
              src={iconPreview}
              alt="Preview"
              className="w-80 h-auto mb-2 rounded-lg shadow-lg"
            />
          )}
          <label className="block text-gray-500 font-bold">
            Imagen (Archivo)
          </label>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleIconChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          {errors.icon && (
            <div className="text-red-500">
              {errors.icon.message?.toString()}
            </div>
          )}
        </div>
        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Nombre</label>
          <input
            {...register('name')}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.name && (
            <div className="text-red-500">
              {errors.name.message?.toString()}
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditMode ? 'Actualizando...' : 'Creando...') 
              : (isEditMode ? 'Actualizar' : 'Crear')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;