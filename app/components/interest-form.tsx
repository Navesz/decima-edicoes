'use client';

import { ArrowRight, Check } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

export function InterestForm() {
  const [sent, setSent] = useState(false);
  const confirmation = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent) confirmation.current?.focus();
  }, [sent]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div ref={confirmation} className="form-success" role="status" tabIndex={-1}>
        <Check />
        <div><strong>Fluxo de interesse concluído.</strong><p>Nenhum dado foi enviado ou armazenado. O canal definitivo será conectado antes do lançamento comercial.</p><button type="button" onClick={() => setSent(false)}>Voltar ao formulário</button></div>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={submit} aria-describedby="interest-note">
      <label><span>Nome</span><input name="name" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
      <label><span>E-mail</span><input type="email" name="email" autoComplete="email" required placeholder="voce@email.com" /></label>
      <label><span>Interesse</span><select name="interest" defaultValue="Yggdrasil 01/10"><option>Yggdrasil 01/10</option><option>Próximas coleções</option><option>Parceria com arquitetos</option></select></label>
      <button type="submit">Simular entrada na lista <ArrowRight size={17} /></button>
      <small id="interest-note">Demonstração do fluxo. Nenhum dado é transmitido, armazenado ou usado como reserva.</small>
    </form>
  );
}
