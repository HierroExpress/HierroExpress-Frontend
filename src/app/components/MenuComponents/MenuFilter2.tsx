import { Category } from '@/types';

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
 

 

  return (
    <div className="border sm:p-0 md:p-4 rounded-lg shadow-md mb-4 ">
      <h2 className="text-lg font-bold mb-2 text-center">Filtros</h2>
      <div className=" flex ">
        <div className=" w-1/2 border-r p-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Categorías</h3>

            {categories
              .filter((category) => category.parentCategory === null)
              .map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center border-b p-2 ${selectedCategory === category.id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleSelectCategory(category.id, false)}
                >
                  <img
                    src={category.icon} // Renderiza la URL como una imagen
                    alt={category.name}
                    className="h-6 w-6 object-contain"
                  />

                  {category.name}
                </div>
              ))}
          </div>
        </div>

        <div className="w-1/2 p-4 m-0">
          <div>
            <h3 className="text-lg font-bold mb-2">Subcategorías</h3>

            {subCategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className={`flex items-center p-2 border-b  ${selectedSubcategory === subcategory.id ? 'bg-blue-100' : ''}`}
                onClick={() => handleSelectCategory(subcategory.id, true)}
              >
                <img
                  src={subcategory.icon} // Renderiza la URL como una imagen
                  alt={subcategory.name}
                  className="h-6 w-6 object-contain"
                />

              
                {subcategory.name}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">atributos</h3>

            {attributes.map((attribute) => (
              <div key={attribute.id} className="attribute-group">
                <h4 className="text-lg font-bold mb-2">
                  {attribute.name} ({attribute.units})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {attribute.productAtributes.map((attrValue) => (
                    <button
                      key={attrValue.value}
                      className={`border-2 py-1 px-3 rounded hover:bg-primary-600 ${
                        selectedAttributes.find(
                          (attr) =>
                            attr.attributeId === attribute.id &&
                            attr.value === attrValue.value,
                        )
                          ? 'bg-orange-400'
                          : 'bg-orange-50'
                      }`}
                      onClick={() =>
                        handleToggleAttribute(attribute.id, attrValue.value)
                      }
                    >
                      {attrValue.value}
                    </button>
                  ))}
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
