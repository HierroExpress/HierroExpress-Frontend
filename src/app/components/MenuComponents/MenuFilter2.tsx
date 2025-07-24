import { useState, useRef } from 'react';
import { Category } from '@/types';
import { inchToMmMap } from '@/lib/unitConversion';

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
  const subcategoriesRef = useRef<HTMLDivElement>(null);
  const attributesRef = useRef<HTMLDivElement>(null);

  const convertMmToInches = (mmValue: string): string | null => {
    const match = inchToMmMap.find((entry) => entry.mm === mmValue);
    return match ? match.in : null;
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    // Solo hacer scroll en móvil
    if (window.innerWidth < 1024 && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  };

  const handleCategoryClick = (categoryId: number, isSubcategory: boolean) => {
    handleSelectCategory(categoryId, isSubcategory);
    
    if (!isSubcategory) {
      // Si seleccionó una categoría principal, scroll a subcategorías
      scrollToSection(subcategoriesRef);
    } else {
      // Si seleccionó una subcategoría, scroll a atributos
      scrollToSection(attributesRef);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/20 p-4">
        <h2 className="text-xl font-bold text-white text-center">Filtros</h2>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Categorías */}
        <div className="lg:w-1/3 border-r border-white/20 p-4">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-1 h-6 bg-blue-400 rounded-full mr-3"></div>
            Categorías
          </h3>
          <div className="space-y-2">
            {categories
              .filter((category) => category.parentCategory === null)
              .map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all bg-orange-500 duration-200 hover:bg-orange-400 ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 border border-orange-400/50 shadow-md'
                      : 'bg-orange-500 hover:bg-orange-400'
                  }`}
                  onClick={() => handleCategoryClick(category.id, false)}
                >
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <img
                      src={category.icon ?? 'https://res.cloudinary.com/dqsxlntau/image/upload/v1742489934/kxko43rpoe8hiuc9malu.svg'}
                      alt={category.name}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <span className="text-white font-medium">{category.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Subcategorías */}
        <div
          ref={subcategoriesRef}
          className="lg:w-1/3 border-r border-white/20 p-4"
        >
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <div className="w-1 h-6 bg-purple-400 rounded-full mr-3"></div>
            Subcategorías
          </h3>
          <div className="space-y-2">
            {subCategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-blue-500 hover:bg-blue-400 cursor-pointer transition-all duration-200 ${
                  selectedSubcategory === subcategory.id
                    ? 'bg-blue-500 text-white border border-blue-400 shadow-md'
                    : 'bg-blue-400 hover:bg-blue-500'
                }`}
                onClick={() => handleCategoryClick(subcategory.id, true)}
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
<img
  src={
    typeof subcategory.icon === 'string' && subcategory.icon.includes('.png')
      ? 'https://res.cloudinary.com/dqsxlntau/image/upload/v1742489934/kxko43rpoe8hiuc9malu.svg'
      : subcategory.icon ?? 'https://res.cloudinary.com/dqsxlntau/image/upload/v1742489934/kxko43rpoe8hiuc9malu.svg'
  }
  alt={subcategory.name}
  className="h-5 w-5 object-contain"
/>
                </div>
                <span className="text-white font-medium">{subcategory.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atributos */}
        <div ref={attributesRef} className="lg:w-1/3 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <div className="w-1 h-6 bg-orange-400 rounded-full mr-3"></div>
              Atributos
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/80">mm</span>
              <button
                onClick={() => setShowInInches(!showInInches)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showInInches ? 'bg-blue-600' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showInInches ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-white/80">in</span>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-base font-semibold mb-3 text-white">
                  {attribute.name} 
                  <span className="text-white/60 ml-1">({attribute.units})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {attribute.productAtributes
                    .sort((a, b) => {
                      // Verificar si ambos valores son números
                      const aNum = parseFloat(a.value);
                      const bNum = parseFloat(b.value);
                      
                      if (!isNaN(aNum) && !isNaN(bNum)) {
                        return bNum - aNum; // Orden descendente (mayor a menor)
                      }
                      
                      // Si no son números, ordenar alfabéticamente
                      return a.value.localeCompare(b.value);
                    })
                    .map((attrValue) => {
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
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isSelected 
                            ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                            : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
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