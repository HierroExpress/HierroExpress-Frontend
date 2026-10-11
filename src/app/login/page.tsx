import { LoginForm } from '@/app/components/login/login';

export default function LoginPage() {
  return (
    <main className="he-auth-page">
      <section className="he-auth-card">
        <p className="he-eyebrow">MI CUENTA</p>
        <h1>Ingresá a tu cuenta</h1>
        <p>Consultá tus pedidos y guardá tus datos para la próxima compra.</p>
        <LoginForm />
      </section>
    </main>
  );
}
