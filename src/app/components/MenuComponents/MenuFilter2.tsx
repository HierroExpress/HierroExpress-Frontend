import { useState } from 'react';
import { Category } from '@/types';
import { inchToMmMap } from '@/lib/unitConversion'; // importa tu mapping

interface MenuFiltersProps {
  handleSelectCategory: (categoryId: number, isSubcategory?: boolean) => void;
  subCategories: Category[];
  categories: Category[];
  selectedCategory: number | undefined;
  selectedSubcategory: number | undefined;
  attributes: {
    id: number;
    name: string;
    units: string;
    productAtributes: { value: string }[];
  }[];
  selectedAttributes: { attributeId: number; value: string }[];
  handleToggleAttribute: (attributeId: number, value: string) => void;
}

const MenuFilters2: React.FC<MenuFiltersProps> = ({
  handleSelectCategory,
  subCategories,
  categories,
  selectedCategory,
  selectedSubcategory,
  attributes,
  selectedAttributes,
  handleToggleAttribute,
}) => {
  const [showInInches, setShowInInches] = useState(false);

  const convertMmToInches = (mmValue: string): string | null => {
    const match = inchToMmMap.find((entry) => entry.mm === mmValue);
    return match ? match.in : null;
  };

  return (
    <div className="border sm:p-0 md:p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-lg font-bold mb-2 text-center">Filtros</h2>
      <div className="flex">
        <div className="w-1/2 border-r p-4">
          <h3 className="text-lg font-bold mb-2">Categorías</h3>
          {categories
            .filter((category) => category.parentCategory === null)
            .map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-2 border-b p-2 cursor-pointer ${selectedCategory === category.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelectCategory(category.id, false)}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="h-6 w-6 object-contain"
                />
                {category.name}
              </div>
            ))}
        </div>

        <div className="w-1/2 p-4">
          <h3 className="text-lg font-bold mb-2">Subcategorías</h3>
          {subCategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className={`flex items-center gap-2 p-2 border-b cursor-pointer ${selectedSubcategory === subcategory.id ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelectCategory(subcategory.id, true)}
            >
              <img
                src={subcategory.icon}
                alt={subcategory.name}
                className="h-6 w-6 object-contain"
              />
              {subcategory.name}
            </div>
          ))}

          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2 flex justify-between items-center">
              Atributos
              <label className="text-sm font-normal">
                <input
                  type="checkbox"
                  checked={showInInches}
                  onChange={() => setShowInInches(!showInInches)}
                  className="mr-1"
                />
                Mostrar en pulgadas
              </label>
            </h3>

            {attributes.map((attribute) => (
              <div key={attribute.id} className="mb-4">
                <h4 className="text-base font-semibold mb-1">
                  {attribute.name} ({attribute.units})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {attribute.productAtributes.map((attrValue) => {
                    const displayValue =
                      showInInches && attribute.units.toLowerCase() === 'mm'
                        ? convertMmToInches(attrValue.value) || attrValue.value
                        : attrValue.value;

                    const isSelected = selectedAttributes.find(
                      (attr) =>
                        attr.attributeId === attribute.id &&
                        attr.value === attrValue.value,
                    );

                    return (
                      <button
                        key={attrValue.value}
                        className={`border-2 py-1 px-3 rounded hover:bg-primary-600 ${
                          isSelected ? 'bg-orange-400' : 'bg-orange-50'
                        }`}
                        onClick={() =>
                          handleToggleAttribute(attribute.id, attrValue.value)
                        }
                      >
                        {displayValue}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuFilters2;
