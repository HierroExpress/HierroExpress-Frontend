import MapFerreria from "../shared/maps/map";
import { ImageBanner } from "./Carousel/caroulselHome";
import { FeturedProducts } from "./components/ featuredProducts/ featuredProducts";
import { CategoriesContainer } from "../shared/categories/categoriesContainer";

export default function Home() {
  return (
    <div>
      <ImageBanner />
      <CategoriesContainer />
      <FeturedProducts />
      <MapFerreria />
    </div>
  );
}
