
import Menu2 from "../components/menu2";

export default function Select({
  params,
}: {
  params: { id: string }; // Permitir un string genérico para `hubCategory`
}) {
  const { id } = params;

  return <Menu2 categoryId={+id} />;
}