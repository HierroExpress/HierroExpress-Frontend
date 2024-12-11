export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-primary-500 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};
