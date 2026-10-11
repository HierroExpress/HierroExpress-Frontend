'use client';
import { useForm } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { showToast } from '@/lib/utils';
import { useEffect, useState } from 'react';

const formSchema = {
  email: '',
  password: '',
};

export function LoginForm() {
  const { login } = useAuth();
  const form = useForm({
    defaultValues: formSchema,
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

  async function onSubmit(values: typeof formSchema) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: 'POST',
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        },
      );

      if (response.status === 201) {
        const data = await response.json();
        login(data.user, data.access_token);
        showToast('success', <p>Has iniciado sesión correctamente</p>);

        if (data.user.role === 'admin') {
          router.push('/admin-history');
        } else if (data.user.role === 'superadmin') {
          router.push('/superadmin/dashboard');
        } else {
          router.push('/address');
        }
      } else {
        const res = await response.json();
        showToast('error', <p>{res.message}</p>);
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      showToast(
        'error',
        <p>
          Ocurrió un error durante el inicio de sesión, por favor intenta de
          nuevo más tarde
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="login-email">Correo electrónico</label>
              <FormControl>
                <Input id="login-email" type="email" autoComplete="email" placeholder="nombre@correo.com" {...field} />
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
              <label htmlFor="login-password">Contraseña</label>
              <div className="text-red-600 relative">
                <FormControl>
                  <Input
                    id="login-password"
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
        <Button type="submit" variant="submit" size="submit" className="he-auth-submit">
          Iniciar sesión
        </Button>
      </form>
      <div className="he-auth-links">
        <Link href="/req-reset">¿Olvidaste tu contraseña?</Link>
        <p>¿Todavía no tenés cuenta? <Link href="/register">Registrate</Link></p>
      </div>
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
