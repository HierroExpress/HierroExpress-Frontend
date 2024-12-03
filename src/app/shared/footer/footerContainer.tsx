import { footerArray } from "@/utils/arrays/footerarray";
import { FooterSection } from "./footersection";

export const FooterContainer = () => {
  return (
    <footer className="bg-primary-500 py-8  ">
      <div className="container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2">
        {Object.keys(footerArray).map((key, index) => (
          <FooterSection
            key={index}
            footerSection={footerArray[key as keyof typeof footerArray].options}
            title={footerArray[key as keyof typeof footerArray].title}
          />
        ))}
      </div>
    </footer>
  );
};
