'use client';

import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './brand-logo';

type Props = { tone?: 'light' | 'dark' };

export function SiteHeader({ tone = 'light' }: Props) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const links = [
    ['/colecoes', 'Coleções'],
    ['/#manifesto', 'Manifesto'],
    ['/caderno', 'Caderno do Atelier'],
  ];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !menuPanel.current) return;
      const focusable = Array.from(menuPanel.current.querySelectorAll<HTMLElement>('a, button:not([disabled])'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${tone === 'dark' ? 'header-dark' : ''}`}>
        <Link className="brand" href="/" aria-label="DÉCIMA Edições — início">
          <BrandLogo />
        </Link>
        <nav aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="header-cta" href="/#interesse">
          Acompanhar edição <ArrowUpRight size={13} strokeWidth={1.5} />
        </Link>
        <button ref={menuButton} className="menu-button" type="button" aria-label="Abrir menu" aria-expanded={open} aria-controls="menu-movel" onClick={() => setOpen(true)}>
          <Menu size={20} strokeWidth={1.25} />
        </button>
      </header>

      <div
        ref={menuPanel}
        id="menu-movel"
        className="mobile-menu"
        data-open={open}
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-hidden={!open}
        aria-label="Navegação móvel"
        inert={!open}
      >
        <button ref={closeButton} type="button" aria-label="Fechar menu" onClick={() => setOpen(false)}><X /></button>
        <p>DÉCIMA EDIÇÕES</p>
        <nav aria-label="Menu móvel">
          {links.map(([href, label], index) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
        </nav>
        <small>Objetos que não se repetem.</small>
      </div>
    </>
  );
}
