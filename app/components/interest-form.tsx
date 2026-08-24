'use client';

import { ArrowRight, Check } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

type FieldName = 'name' | 'email';
type FormErrors = Partial<Record<FieldName, string>>;

export function InterestForm() {
  const [ready, setReady] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const confirmation = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (sent) confirmation.current?.focus();
    else if (hasCompleted.current) nameInput.current?.focus();
  }, [sent]);

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const nextErrors: FormErrors = {};

    if (name.value.trim().length < 2) nextErrors.name = 'Informe um nome com pelo menos dois caracteres.';
    if (!email.value.trim()) nextErrors.email = 'Informe seu e-mail.';
    else if (!email.validity.valid) nextErrors.email = 'Digite um e-mail em formato válido.';

    setErrors(nextErrors);
    const firstInvalid = (['name', 'email'] as FieldName[]).find((field) => nextErrors[field]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement).focus();
      return;
    }

    hasCompleted.current = true;
    setSent(true);
  }

  function reset() {
    setErrors({});
    setSent(false);
  }

  if (sent) {
    return (
      <div ref={confirmation} className="form-success" role="status" tabIndex={-1}>
        <Check />
        <div><strong>Fluxo de interesse concluído.</strong><p>Nenhum dado foi enviado ou armazenado. O canal definitivo será conectado antes do lançamento comercial.</p><button type="button" onClick={reset}>Voltar ao formulário</button></div>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={submit} aria-describedby="interest-note" noValidate data-local-demo>
      <fieldset disabled={!ready}>
        <label className={errors.name ? 'field-invalid' : undefined}>
          <span>Nome</span>
          <input ref={nameInput} name="name" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? 'name-error' : undefined} onInput={() => clearError('name')} placeholder="Como podemos chamar você?" />
          {errors.name && <small className="field-error" id="name-error" role="alert">{errors.name}</small>}
        </label>
        <label className={errors.email ? 'field-invalid' : undefined}>
          <span>E-mail</span>
          <input type="email" name="email" autoComplete="email" required maxLength={160} inputMode="email" spellCheck={false} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'email-error' : undefined} onInput={() => clearError('email')} placeholder="voce@email.com" />
          {errors.email && <small className="field-error" id="email-error" role="alert">{errors.email}</small>}
        </label>
        <label><span>Interesse</span><select name="interest" defaultValue="Yggdrasil 01/10"><option>Yggdrasil 01/10</option><option>Próximas coleções</option><option>Parceria com arquitetos</option></select></label>
        <button type="submit">Simular entrada na lista <ArrowRight size={17} /></button>
      </fieldset>
      <small id="interest-note">Demonstração do fluxo. Nenhum dado é transmitido, armazenado ou usado como reserva.</small>
      <noscript><small className="form-noscript">A simulação local requer JavaScript. Nenhum campo foi habilitado e nenhum dado será enviado.</small></noscript>
    </form>
  );
}
