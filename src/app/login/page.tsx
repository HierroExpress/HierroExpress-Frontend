import { LoginForm } from '@/app/components/login/login';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="bg-white text-blue-900 p-8 rounded-lg shadow-md w-[380px] mx-4 my-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center">Hierro Express</h1>
          <h2 className="text-lg text-center mt-2 mb-6">Iniciar Sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
