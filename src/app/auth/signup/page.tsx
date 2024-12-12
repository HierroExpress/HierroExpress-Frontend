"use client";

import Link from "next/link";
import { FormContainer } from "../components/formContainer";
import { arraySignupForm } from "@/utils/arrays/authForms";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SignupPage = () => {
  const { register, error, Justregistered } = useAuth(); // Usa el contexto
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    NIN: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await register(formData);
    setIsSubmitting(false);
  };

  return (
    <FormContainer title="Crear Cuenta">
      {Justregistered ? (
        <div>
          <p className="text-green-500 text-center">
          ¡Registro exitoso! Por favor, inicia sesión.
        </p>
        <Link href="/auth/login">Iniciar session</Link>

        </div>
        
      ) : (
        <>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={formData[form.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder={form.placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-secondary-500 text-white py-2 rounded-md transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary-600"
              }`}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </form>
          <p className="text-sm text-center text-primary-500">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="text-secondary-500 hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </>
      )}
    </FormContainer>
  );
};

export default SignupPage;
