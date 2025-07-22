# Funcionalidad de Aumento de Precios por Porcentaje

## Resumen
Se ha implementado la funcionalidad para aumentar precios por porcentaje en la gestión de productos del SuperAdmin. Ahora los administradores pueden:

1. **Establecer precios fijos** (funcionalidad existente)
2. **Aumentar precios por porcentaje** (nueva funcionalidad)

## Cambios Implementados en Frontend

### 1. Interfaz de Usuario
- Se agregó un radio button para elegir entre "Establecer Precio Fijo" y "Aumentar por Porcentaje"
- Se cambió el botón "Precios por Familia" a "Aumentar Precios por Familia" y ahora abre el modal en modo porcentaje por defecto
- Se agregó un campo de entrada específico para porcentajes con símbolo % y texto de ayuda

### 2. Lógica Frontend
- Nuevos estados: `priceUpdateType` ('fixed' | 'percentage') y `percentage`
- Validación específica para porcentajes (debe ser > 0)
- Cálculo local del nuevo precio cuando se seleccionan productos individuales
- Mensajes de confirmación específicos para cada tipo de actualización

### 3. API Call
- Se modificó la función `updateBulkProductPrice` para soportar campo opcional `percentage`
- El endpoint `/products/bulk-price` ahora puede recibir tanto `price` como `percentage`

## Cambios Requeridos en Backend

### Endpoint: `PUT /products/bulk-price`

#### Request Body Actualizado:
```typescript
{
  productIds?: string[],        // IDs de productos específicos (opcional)
  categoryId?: number,          // ID de categoría (opcional)
  price?: number,              // Precio fijo (opcional)
  percentage?: number          // Porcentaje de aumento (opcional, NUEVO)
}
```

#### Lógica Requerida en Backend:

1. **Validación**:
   - Debe recibir `price` O `percentage`, no ambos
   - `percentage` debe ser un número positivo
   - Debe recibir `productIds` O `categoryId`, no ambos

2. **Procesamiento**:
   ```javascript
   if (percentage) {
     // Aplicar aumento por porcentaje
     newPrice = currentPrice * (1 + percentage / 100)
   } else if (price) {
     // Establecer precio fijo
     newPrice = price
   }
   ```

3. **Alcance**:
   - Si se proporciona `categoryId` + `percentage`: aumentar todos los productos de esa categoría por el porcentaje especificado
   - Si se proporciona `productIds` + `percentage`: aumentar solo los productos especificados por el porcentaje

#### Ejemplo de Uso:
```javascript
// Aumentar 10% todos los productos de la categoría "Caños" (ID: 3)
{
  "categoryId": 3,
  "percentage": 10
}

// Aumentar 15% productos específicos
{
  "productIds": ["1", "2", "3"],
  "percentage": 15
}
```

#### Response Esperado:
```javascript
{
  "success": true,
  "data": {
    "updatedCount": 25,
    "message": "Precios actualizados correctamente"
  }
}
```

## Ejemplo de Flujo de Usuario

1. El usuario va a la lista de productos del SuperAdmin
2. Hace clic en "Aumentar Precios por Familia"
3. Selecciona la categoría "Caños"
4. Elige "Aumentar por Porcentaje" (viene seleccionado por defecto)
5. Ingresa "10" en el campo de porcentaje
6. Hace clic en "Actualizar Precios"
7. Todos los productos de la categoría "Caños" aumentan su precio en 10%

## Archivos Modificados

- `/src/app/components/SuperAdminProducts/productList.tsx`
- `/src/helpers/peticionesSuperAdmin.tsx`

## Testing Manual

Para probar la funcionalidad:
1. Navegar a `/superadmin/products`
2. Seleccionar algunos productos y usar "Modificar Precios"
3. Usar el botón "Aumentar Precios por Familia"
4. Verificar que ambos modos (precio fijo y porcentaje) funcionan correctamente