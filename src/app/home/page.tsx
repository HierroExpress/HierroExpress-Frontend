import MapFerreria from "../shared/maps/map";
import { FeturedProducts } from "./components/ featuredProducts/ featuredProducts";
import { ImageCarousel } from "./components/Carousel/carouselHome";
import { CategoriesContainer } from "./components/categories/categoriesContainer";

export default function Home() {
  return (
    <div>
      <ImageCarousel />
      <CategoriesContainer />
      <FeturedProducts />
      <MapFerreria />
      
    </div>
  );
}
