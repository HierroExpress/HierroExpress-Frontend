"use client";

import Link from "next/link";
import { FormContainer } from "../components/formContainer";
import { arrayLoginForm } from "@/utils/arrays/authForms";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { login, error, isLoggedIn } = useAuth(); 
  const [formData, setFormData] = useState({ email: "", password: "" }); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 
    await login(formData);
    setIsSubmitting(false);
  };

  return (
    <FormContainer title="Iniciar Sesión">
      {isLoggedIn ? (
        <p className="text-green-500 text-center">¡Has iniciado sesión con éxito!</p>
      ) : (
        <>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
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
        </>
      )}
    </FormContainer>
  );
};

export default LoginPage;
