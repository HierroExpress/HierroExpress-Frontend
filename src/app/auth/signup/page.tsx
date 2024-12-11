import Link from "next/link";
import { FormContainer } from "../components/formContainer";
import { arraySignupForm } from "@/utils/arrays/authForms";
const SignupPage = () => {
  return (
    <FormContainer title="Crear Cuenta">
      <form className="space-y-4">
        {arraySignupForm.map((form) => (
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
          Registrarse
        </button>
      </form>
      <p className="text-sm text-center text-primary-500">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="text-secondary-500 hover:underline">
          Inicia Sesión
        </Link>
      </p>
    </FormContainer>
  );
};

export default SignupPage;
