'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Props = { tone?: 'light' | 'dark' };

export function SiteHeader({ tone = 'light' }: Props) {
  const [open, setOpen] = useState(false);
  const links = [
    ['/colecoes', 'Coleções'],
    ['/#manifesto', 'Manifesto'],
    ['/caderno', 'Caderno do Atelier'],
  ];

  return (
    <>
      <header className={`site-header ${tone === 'dark' ? 'header-dark' : ''}`}>
        <Link className="brand" href="/" aria-label="DÉCIMA Edições — início">
          <span className="brand-mark">X</span>
          <span>DÉCIMA <i>EDIÇÕES</i></span>
        </Link>
        <nav aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="header-cta" href="/#interesse">
          Solicitar peça <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
        <button className="menu-button" type="button" aria-label="Abrir menu" onClick={() => setOpen(true)}>
          <Menu size={20} strokeWidth={1.25} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: .55, ease: [0.76, 0, 0.24, 1] }}
          >
            <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}><X /></button>
            <p>DÉCIMA EDIÇÕES</p>
            <nav aria-label="Menu móvel">
              {links.map(([href, label], index) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  <span>0{index + 1}</span>{label}
                </Link>
              ))}
            </nav>
            <small>Objetos que não se repetem.</small>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
