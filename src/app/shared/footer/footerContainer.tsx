import { footerArray } from "@/utils/arrays/footerarray";
import { FooterSection } from "./footersection";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export const FooterContainer = () => {
  const socialIcons = [
    { Icon: Instagram, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Facebook, href: "#" },
    { Icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-gray-900 py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.keys(footerArray).map((key, index) => (
            <FooterSection
              key={index}
              footerSection={
                footerArray[key as keyof typeof footerArray].options
              }
              title={footerArray[key as keyof typeof footerArray].title}
              className="space-y-4"
            />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>

          <div className="flex space-x-4">
            {socialIcons.map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
