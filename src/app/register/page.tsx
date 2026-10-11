import { RegisterForm } from '@/app/components/register/register';

export default function LoginPage() {
  return (
    <main className="he-auth-page">
      <section className="he-auth-card">
        <p className="he-eyebrow">CREAR CUENTA</p>
        <h1>Registrate</h1>
        <p>Es opcional para comprar, pero te permite consultar tus pedidos después.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
