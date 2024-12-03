import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { FooterSectionType } from "./footerTypes";

export const FooterSection = ({
  footerSection,
  title,
}: {
  footerSection: FooterSectionType[];
  title: string;
}) => {
  return (
    <section className=" flex flex-col gap-4 items-start lg:px-20">
      <h2 className="text-secondary-500 text-start text-4xl">{title}</h2>
      {footerSection.map((section, index) => (
        <div
          className="flex flex-row gap-2 items-center border-b-[0.5px] w-full"
          key={index}>
          <div>
            {section.icono ? (
              <section.icono className="h-12 w-12 text-secondary-500" />
            ) : (
              <QuestionMarkCircleIcon className="h-12 w-12 text-secondary-500" />
            )}
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h3 className="text-2xl font-bold text-secondary-50">
              {section.title}
            </h3>
            <p className="text-sm">{section.describe}</p>
            <a href={section.link} className="text-sm text-secondary-500">
              {section.link}
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};
