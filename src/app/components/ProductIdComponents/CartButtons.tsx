export default function CartButtons({
  quantity,
  onIncrease,
  onDecrease,
  addToCart,
}: {
  quantity: any;
  onIncrease: any;
  onDecrease: any;
  addToCart: any;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onDecrease}
        className="bg-blue-600 text-white rounded-full p-2 mr-4"
      >
        -
      </button>
      <div className="flex items-center">
        <span className="text-lg font-semibold">{quantity}</span>
      </div>
      <button
        onClick={onIncrease}
        className="bg-blue-600 text-white rounded-full p-2 ml-4"
      >
        +
      </button>
      <div className="ml-4 flex-grow">
        <button
          onClick={addToCart}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 w-full white-space:nowrap"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
