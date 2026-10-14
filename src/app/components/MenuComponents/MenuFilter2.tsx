import { useState } from 'react';
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

export default function MenuFilters2({
  handleSelectCategory,
  subCategories,
  categories,
  selectedCategory,
  selectedSubcategory,
  attributes,
  selectedAttributes,
  handleToggleAttribute,
}: MenuFiltersProps) {
  const [showInInches, setShowInInches] = useState(false);
  return (
    <div className="he-filters">
      <section>
        <h3>Elija una familia</h3>
        {categories
          .filter((category) => !category.parentCategory)
          .map((category) => (
            <button
              className={selectedCategory === category.id ? 'is-selected' : ''}
              aria-pressed={selectedCategory === category.id}
              key={category.id}
              onClick={() => handleSelectCategory(category.id, false)}
            >
              {category.name.toLocaleLowerCase('es')}
              <span>›</span>
            </button>
          ))}
      </section>
      {subCategories.length > 0 && (
        <section>
          <h3>Elija el tipo de material</h3>
          {subCategories.map((category) => (
            <button
              key={category.id}
              className={
                selectedSubcategory === category.id ? 'is-selected' : ''
              }
              aria-pressed={selectedSubcategory === category.id}
              onClick={() => handleSelectCategory(category.id, true)}
            >
              {category.name.toLocaleLowerCase('es')}
              <span>›</span>
            </button>
          ))}
        </section>
      )}
      {attributes.length > 0 && (
        <section>
          <div className="he-filter-title">
            <h3>Medidas y atributos</h3>
            <button
              className="he-unit-toggle"
              onClick={() => setShowInInches(!showInInches)}
              aria-label="Cambiar unidad de medida"
            >
              {showInInches ? 'in → mm' : 'mm → in'}
            </button>
          </div>
          {attributes.map((attribute) => (
            <div className="he-attribute" key={attribute.id}>
              <h4>
                {attribute.name} <span>({attribute.units})</span>
              </h4>
              <div>
                {Array.from(
                  new Set(
                    attribute.productAtributes.map((value) => value.value),
                  ),
                )
                  .sort((a, b) =>
                    a.localeCompare(b, undefined, { numeric: true }),
                  )
                  .map((value) => (
                    <button
                      key={value}
                      aria-pressed={selectedAttributes.some(
                        (attr) =>
                          attr.attributeId === attribute.id &&
                          attr.value === value,
                      )}
                      className={
                        selectedAttributes.some(
                          (attr) =>
                            attr.attributeId === attribute.id &&
                            attr.value === value,
                        )
                          ? 'is-selected'
                          : ''
                      }
                      onClick={() => handleToggleAttribute(attribute.id, value)}
                    >
                      {showInInches && attribute.units.toLowerCase() === 'mm'
                        ? inchToMmMap.find((entry) => entry.mm === value)?.in ||
                          value
                        : value}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
