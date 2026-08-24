import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import type { Metadata } from 'next';
import { SmoothScroll } from './components/smooth-scroll';
import './globals.css';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: 'DÉCIMA Edições — Objetos que não se repetem', template: '%s · DÉCIMA' },
  description: 'Mesas autorais em madeira e aço, produzidas em coleções de apenas dez peças numeradas.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DÉCIMA Edições',
    title: 'DÉCIMA Edições — Objetos que não se repetem',
    description: 'Mesas autorais em séries de dez peças. Uma edição. Nenhuma reimpressão.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'DÉCIMA Edições — Objetos que não se repetem' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DÉCIMA Edições — Objetos que não se repetem',
    description: 'Mesas autorais em séries de dez peças. Uma edição. Nenhuma reimpressão.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><SmoothScroll />{children}</body></html>;
}
