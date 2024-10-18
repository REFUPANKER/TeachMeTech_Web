import '@fortawesome/fontawesome-free/css/all.min.css';
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'Teach Me Tech',
  description: 'The New Place to Learn',
}
export default function RootLayout({children,}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body style={{ background: "#101010" }}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
