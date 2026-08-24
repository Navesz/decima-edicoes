import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SmoothScroll } from './components/smooth-scroll';
import { absoluteUrl, siteDescription, siteName, siteOrigin } from './lib/site';
import './globals.css';

const cormorant = localFont({
  src: [
    { path: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = localFont({
  src: [
    { path: '../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: 'DÉCIMA Edições — Objetos que não se repetem', template: '%s · DÉCIMA' },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: absoluteUrl('/') }],
  creator: siteName,
  publisher: siteName,
  category: 'design de mobiliário',
  keywords: ['mesas autorais', 'mobiliário brasileiro', 'edição limitada', 'madeira maciça', 'design colecionável'],
  alternates: { canonical: absoluteUrl('/') },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName,
    url: absoluteUrl('/'),
    title: 'DÉCIMA Edições — Objetos que não se repetem',
    description: 'Mesas autorais em séries de dez peças. Uma edição. Nenhuma reimpressão.',
    images: [{ url: absoluteUrl('/og.jpg'), width: 1200, height: 630, alt: 'DÉCIMA Edições — Objetos que não se repetem' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DÉCIMA Edições — Objetos que não se repetem',
    description: 'Mesas autorais em séries de dez peças. Uma edição. Nenhuma reimpressão.',
    images: [absoluteUrl('/og.jpg')],
  },
};

const brandSchema = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: siteName,
  description: siteDescription,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/brand/decima-logo-dark.png'),
  slogan: 'Objetos que não se repetem.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <SmoothScroll />
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }} />
      </body>
    </html>
  );
}
