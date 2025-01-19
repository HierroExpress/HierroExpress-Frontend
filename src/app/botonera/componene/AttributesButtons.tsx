"use client";

export const AttributesButtons = ({
  attributes,
  onToggleAttribute,
}: {
  attributes: {
    id: number,
    name: string,
    units: string,
    productAtributes: { value: string }[],
  }[],
  onToggleAttribute: (attributeId: number, value: string) => void,
}) => {
  return (
    <div className="attributes-buttons">
      {attributes.map((attribute) => (
        <div key={attribute.id} className="attribute-group">
          <h4 className="text-lg font-bold mb-2">
            {attribute.name} ({attribute.units})
          </h4>
          <div className="flex flex-wrap gap-2">
            {attribute.productAtributes.map((attrValue) => (
              <button
                key={attrValue.value}
                className="bg-primary-500 text-white py-1 px-3 rounded hover:bg-primary-600"
                onClick={() =>
                  onToggleAttribute(attribute.id, attrValue.value)
                }>
                {attrValue.value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
