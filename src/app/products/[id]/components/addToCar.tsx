export const AddToCar = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center">
        <button>-</button>
        <input></input>
        <button>+</button>
      </div>
      <button className=" bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
        {" "}
        AÑADIR AL CARRITO
      </button>
    </div>
  );
};
