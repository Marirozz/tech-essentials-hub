import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://techessentialshub.com"),
  title: {
    default: "Tech Essentials Hub",
    template: "%s | Tech Essentials Hub",
  },
  description: "Tecnología útil para trabajar mejor y vivir con más comodidad.",

  verification: {
    other: {
       "p:domain_verify": "06310396261b4655bbbad5b7b1042765"
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
