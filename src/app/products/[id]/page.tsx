import { ProductContainer } from "./components/productsContainer";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <ProductContainer id={id} />
    </div>
  );
};

export default ProductPage;
