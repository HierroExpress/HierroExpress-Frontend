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
    <section className="flex flex-col gap-4 items-start lg:px-4">
      <h2 className="text-secondary-500 text-start text-2xl font-semibold">
        {title}
      </h2>
      {footerSection.map((section, index) => (
        <div
          className="flex flex-row gap-3 items-center border-b-[0.5px] border-secondary-700/30 w-full pb-3"
          key={index}
        >
          <div>
            {section.icono ? (
              <section.icono className="h-8 w-8 text-secondary-500" />
            ) : (
              <QuestionMarkCircleIcon className="h-8 w-8 text-secondary-500" />
            )}
          </div>
          <div className="flex flex-col gap-1 items-start">
            <h3 className="text-lg font-bold text-secondary-50">
              {section.title}
            </h3>
            <p className="text-xs text-secondary-200">{section.describe}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
