import { HeaderContainer } from "./components/header/headerContainer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
              <HeaderContainer />
              <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
