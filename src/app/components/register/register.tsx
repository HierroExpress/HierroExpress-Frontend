'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { showToast } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    email: z
      .string()
      .email({ message: 'Debe ser un correo electrónico válido.' }),
    password: z
      .string()
      .min(8, {
        message: 'La contraseña debe tener por lo menos 8 caracteres.',
      })
      .regex(/[a-z]/, {
        message: 'La contraseña debe contener al menos una letra minúscula.',
      })
      .regex(/[A-Z]/, {
        message: 'La contraseña debe contener al menos una letra mayúscula.',
      })
      .regex(/[0-9]/, {
        message: 'La contraseña debe contener al menos un número.',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'La contraseña debe contener al menos un carácter especial.',
      }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, { message: 'El teléfono debe tener al menos 10 caracteres.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir.',
    path: ['confirmPassword'],
  });

type FormSchema = z.infer<typeof formSchema>;

export function RegisterForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const { watch, trigger } = form;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const subscription = watch(() => {
      trigger();
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  async function onSubmit(values: FormSchema) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            phone: values.phone,
          }),
        },
      );

      if (response.status === 201) {
        showToast(
          'success',
          <p>Te has registrado correctamente, por favor inicia sesión</p>,
        );
        router.push('/login');
      } else {
        const res = await response.json();
        if (res.message) {
          showToast('error', <p>{res.message}</p>);
        } else {
          showToast(
            'error',
            <p>Ocurrió un error desconocido durante el registro</p>,
          );
        }
        console.error('Error durante el registro:', res);
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      showToast(
        'error',
        <p>
          Ocurrió un error durante el registro, por favor intenta de nuevo más
          tarde
        </p>,
      );
    }
  }

  function handleGoogleLogin() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="he-auth-form">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="register-name">Nombre y apellido</label>
              <FormControl>
                <Input id="register-name" autoComplete="name" placeholder="Tu nombre completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="register-email">Correo electrónico</label>
              <FormControl>
                <Input id="register-email" type="email" autoComplete="email" placeholder="nombre@correo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="register-password">Contraseña</label>
              <div className="text-red-600 relative">
                <FormControl>
                  <Input
                    id="register-password"
                    placeholder="Contraseña"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                  />
                </FormControl>
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="register-confirm-password">Repetí la contraseña</label>
              <div className="text-red-600 relative">
                <FormControl>
                  <Input
                    id="register-confirm-password"
                    placeholder="Repetir contraseña"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="register-phone">Teléfono o WhatsApp</label>
              <FormControl>
                <Input id="register-phone" type="tel" autoComplete="tel" placeholder="Ej.: 099 123 456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="submit" size="submit" className="he-auth-submit">
          Registrarme
        </Button>
      </form>
      <div className="he-auth-links"><p>¿Ya tenés cuenta? <Link href="/login">Ingresá</Link></p></div>
      <Button
        onClick={handleGoogleLogin}
        type="submit"
        variant="submit"
        size="submit"
        className="he-auth-google"
      >
        <FcGoogle className="text-xl" />
        Ingresar con Google
      </Button>
    </Form>
  );
}
