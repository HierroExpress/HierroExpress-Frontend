import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { getAllCategories } from '@/helpers/peticiones';
import { Attribute } from '@/types';
import { fetchAttributes } from '@/helpers/peticionesSuperAdmin';

// Tipos
type Category = {
  id: number;
  name: string;
};

type AttributeValue = {
  attributeId: number;
  value: string;
};

type ProductFormProps = {
  defaultValues?: any;
  onSubmit: (data: any, imageURL?: string) => void;
  isEditMode?: boolean;
  closeDropdownOnSelect?: boolean;
};

const ProductForm: React.FC<ProductFormProps> = ({
  defaultValues,
  onSubmit,
  isEditMode,
  closeDropdownOnSelect = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    defaultValues?.category?.map((cat: any) => cat?.id) || [],
  );
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<
    AttributeValue[]
  >(defaultValues?.attributes || []);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAttributeDropdownOpen, setIsAttributeDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageURL || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const attributeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error al obtener categorías', error);
      }
    };
    const fetchAttributesData = async () => {
      try {
        const attributesData = await fetchAttributes();
        setAttributes(attributesData);
      } catch (error) {
        console.error('Error al obtener atributos', error);
      }
    };

    fetchAttributesData();
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (defaultValues?.category) {
      setSelectedCategories(
        defaultValues.category
          .filter((cat: any) => cat !== null)
          .map((cat: any) => cat.id),
      );
    }
    if (defaultValues?.attributes) {
      setSelectedAttributes(defaultValues.attributes);
    }
  }, [defaultValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        attributeDropdownRef.current &&
        !attributeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAttributeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev : [...prev, categoryId],
    );
    if (closeDropdownOnSelect) setIsCategoryDropdownOpen(false);
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  const handleAttributeSelect = (attributeId: number) => {
    setSelectedAttributes((prev) => {
      if (!prev.some((attr) => attr.attributeId === attributeId)) {
        return [...prev, { attributeId, value: '' }];
      }
      return prev;
    });
    setIsAttributeDropdownOpen(false);
  };

  const handleAttributeValueChange = (attributeId: number, value: string) => {
    setSelectedAttributes((prev) =>
      prev.map((attr) =>
        attr.attributeId === attributeId ? { ...attr, value } : attr,
      ),
    );
  };

  const removeAttribute = (attributeId: number) => {
    setSelectedAttributes((prev) =>
      prev.filter((attr) => attr.attributeId !== attributeId),
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('image', imageFile);
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
        throw new Error(`Error al subir la imagen: ${errorResponse.message}`);
      }
      const data = await response.json();
      setImagePreview(null);
      setImageFile(null);
      return data.secure_url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  };

  const handleSubmitForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      data.category = selectedCategories;
      data.attributes = selectedAttributes.filter(
        (attr) => attr.value.trim() !== '',
      );
      data.price = parseFloat(data.price);
      data.stock = parseInt(data.stock);

      const imageURL = imageFile ? await handleImageUpload() : null;
      onSubmit(data, imageURL);

      reset();
      setImagePreview(null);
      setImageFile(null);
      setSelectedCategories([]);
      setSelectedAttributes([]);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="items-center min-h-screen">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white shadow-lg rounded-xl max-w-4xl mx-auto"
      >
        {/* Campos existentes: Imagen, Nombre, Descripción, Precio, Stock */}
        <div className="col-span-1 md:col-span-2 mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-80 h-auto mb-2 rounded-lg shadow-lg"
            />
          ) : defaultValues?.imageURL ? (
            <img
              src={defaultValues.imageURL}
              alt="Product Image"
              className="w-80 h-auto mb-2 rounded-lg shadow-lg"
            />
          ) : null}
          <label className="block text-gray-500 font-bold">Imagen</label>
          <input
            type="file"
            {...register('imageURL')}
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border border-gray-500 rounded-lg shadow-sm"
          />
          {errors.imageURL && (
            <div className="text-red-500">Error en la imagen</div>
          )}
        </div>

        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Nombre</label>
          <input
            {...register('name', { required: 'Nombre es requerido' })}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
          />
          {errors.name && <div className="text-red-500">Nombre inválido</div>}
        </div>

        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Descripción</label>
          <textarea
            {...register('description', {
              required: 'Descripción es requerida',
            })}
            className="w-full p-2 border border-gray-500 rounded-lg shadow-sm"
          />
          {errors.description && (
            <div className="text-red-500">Descripción inválida</div>
          )}
        </div>

        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Precio</label>
          <input
            type="number"
            step="0.01"
            {...register('price', {
              required: 'El precio es requerido',
              valueAsNumber: true,
              validate: (value) => value > 0 || 'El precio debe ser positivo',
            })}
            className="w-full p-2 border border-gray-500 rounded-lg shadow-sm"
          />
          {errors.price && <div className="text-red-500">Precio inválido</div>}
        </div>

        <div className="col-span-1 mb-4">
          <label className="block text-gray-500 font-bold">Stock</label>
          <input
            type="number"
            {...register('stock', {
              required: 'El stock es requerido',
              valueAsNumber: true,
              validate: (value) =>
                value >= 0 || 'El stock debe ser no negativo',
            })}
            className="w-full p-2 border border-gray-500 rounded-lg shadow-sm"
          />
          {errors.stock && <div className="text-red-500">Stock inválido</div>}
        </div>

        {/* Sección de Categorías */}
        <div className="col-span-2 border-gray-500">
          <div className="col-span-1 mb-4 relative" ref={categoryDropdownRef}>
            <label className="block text-gray-500 font-bold">Categorías</label>
            <button
              type="button"
              className="w-full p-2 border border-gray-500 rounded-lg shadow-sm bg-white flex justify-between items-center"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              Seleccionar categorías
              <span
                className={`transform transition-transform ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              >
                V
              </span>
            </button>
            {isCategoryDropdownOpen && (
              <ul className="absolute z-10 w-full border border-gray-500 rounded-lg shadow-lg bg-white mt-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2 mb-4">
            <label className="block text-gray-500 font-bold">
              Categorías seleccionadas
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId,
                );
                return category ? (
                  <div
                    key={category.id}
                    className="px-4 py-2 bg-white rounded-full shadow-lg flex items-center"
                  >
                    <span className="mr-2">{category.name}</span>
                    <button
                      type="button"
                      className="text-red-500 font-bold"
                      onClick={() => removeCategory(category.id)}
                    >
                      X
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Sección de Atributos */}
          <div className="col-span-2 mb-4">
            <div className="relative" ref={attributeDropdownRef}>
              <label className="block text-gray-500 font-bold">Atributos</label>
              <button
                type="button"
                className="w-full p-2 border border-gray-500 rounded-lg shadow-sm bg-white flex justify-between items-center"
                onClick={() =>
                  setIsAttributeDropdownOpen(!isAttributeDropdownOpen)
                }
              >
                Seleccionar atributos
                <span
                  className={`transform transition-transform ${
                    isAttributeDropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  V
                </span>
              </button>
              {isAttributeDropdownOpen && (
                <ul className="absolute z-10 w-full border border-gray-500 rounded-lg shadow-lg bg-white mt-2 max-h-60 overflow-y-auto">
                  {attributes
                    .filter(
                      (attr) =>
                        !selectedAttributes.some(
                          (selected) => selected.attributeId === attr.id,
                        ),
                    )
                    .map((attribute) => (
                      <li
                        key={attribute.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAttributeSelect(attribute.id)}
                      >
                        {attribute.name} ({attribute.units})
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Atributos seleccionados con inputs para valores */}
            <div className="mt-4">
              <label className="block text-gray-500 font-bold">
                Atributos seleccionados
              </label>
              <div className="flex flex-col gap-2">
                {selectedAttributes.map((selectedAttr) => {
                  const attribute = attributes.find(
                    (attr) => attr.id === selectedAttr.attributeId,
                  );
                  return attribute ? (
                    <div key={attribute.id} className="flex items-center gap-2">
                      <span className="text-gray-600 min-w-[150px]">
                        {attribute.name} ({attribute.units}):
                      </span>
                      <input
                        type="text"
                        value={selectedAttr.value}
                        onChange={(e) =>
                          handleAttributeValueChange(
                            attribute.id,
                            e.target.value,
                          )
                        }
                        className="p-2 border border-gray-300 rounded-lg shadow-sm flex-1"
                        placeholder={`Valor para ${attribute.name}`}
                      />
                      <button
                        type="button"
                        className="text-red-500 font-bold"
                        onClick={() => removeAttribute(attribute.id)}
                      >
                        X
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Submit */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting
              ? 'Procesando...'
              : isEditMode
                ? 'Actualizar Producto'
                : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
