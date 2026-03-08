
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RIZERWEBNP | Custom Websites for Everyone',
  description: 'Professional custom website development at affordable prices by Biplop Devkota.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-primary min-h-screen gradient-bg">
        {children}
      </body>
    </html>
  );
}
