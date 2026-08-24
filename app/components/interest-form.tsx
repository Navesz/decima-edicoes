'use client';

import { ArrowRight, Check } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function InterestForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <Check />
        <div><strong>Interesse registrado nesta apresentação.</strong><p>O canal definitivo de atendimento será conectado antes do lançamento comercial.</p></div>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={submit}>
      <label><span>Nome</span><input name="name" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
      <label><span>E-mail</span><input type="email" name="email" autoComplete="email" required placeholder="voce@email.com" /></label>
      <label><span>Interesse</span><select name="interest" defaultValue="Yggdrasil 01/10"><option>Yggdrasil 01/10</option><option>Próximas coleções</option><option>Parceria com arquitetos</option></select></label>
      <button type="submit">Entrar na lista privada <ArrowRight size={17} /></button>
      <small>Demonstração sem envio externo. Nenhum dado sai do navegador.</small>
    </form>
  );
}
