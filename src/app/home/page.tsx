import MapFerreria from "../shared/maps/map";
import { FeturedProducts } from "./components/ featuredProducts/ featuredProducts";
import { CategoriesContainer } from "./components/categories/categoriesContainer";

export default function Home() {
  return (
    <div>
      <CategoriesContainer />
      <FeturedProducts />
      <MapFerreria />
      
    </div>
  );
}
