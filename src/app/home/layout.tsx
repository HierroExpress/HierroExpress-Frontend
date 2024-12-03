import { FooterContainer } from "../shared/footer/footerContainer";
import { HeaderContainer } from "../shared/header/headerContainer";

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
        <FooterContainer />
      </body>
    </html>
  );
}
