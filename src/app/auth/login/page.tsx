import Link from "next/link";
import { FormContainer } from "../components/formContainer";
import { arrayLoginForm } from "@/utils/arrays/authForms";

const LoginPage = () => {
  return (
    <FormContainer title="Iniciar Sesión">
      <form className="space-y-4">
        {arrayLoginForm.map((form) => (
          <div key={form.name}>
            <label
              htmlFor={form.name}
              className="block text-sm font-medium text-primary-500">
              {form.label}
            </label>
            <input
              name={form.name}
              id={form.name}
              type={form.type}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-secondary-500 focus:border-secondary-500"
              placeholder={form.placeholder}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-secondary-500 text-white py-2 rounded-md hover:bg-secondary-600 transition">
          Iniciar Sesión
        </button>
      </form>
      <p className="text-sm text-center text-primary-500">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/auth/signup"
          className="text-secondary-500 hover:underline">
          Regístrate
        </Link>
      </p>
    </FormContainer>
  );
};

export default LoginPage;
