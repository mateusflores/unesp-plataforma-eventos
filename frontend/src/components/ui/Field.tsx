import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface FieldProps {
  label?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  children: (id: string) => ReactNode;
  className?: string;
}

export function Field({ label, hint, erro, obrigatorio, children, className = '' }: FieldProps) {
  const id = useId();
  return (
    <div className={`field ${erro ? 'field--erro' : ''} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
          {obrigatorio && <span className="req" aria-hidden>*</span>}
        </label>
      )}
      {children(id)}
      {erro ? (
        <span className="field__error" role="alert">
          <AlertCircle size={13} /> {erro}
        </span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  icone?: ReactNode;
}

export function Input({ label, hint, erro, obrigatorio, icone, className = '', ...rest }: InputProps) {
  return (
    <Field label={label} hint={hint} erro={erro} obrigatorio={obrigatorio}>
      {(id) =>
        icone ? (
          <span className="input-group">
            <span className="input-group__icon">{icone}</span>
            <input id={id} className={`input ${className}`} {...rest} />
          </span>
        ) : (
          <input id={id} className={`input ${className}`} {...rest} />
        )
      }
    </Field>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
}

export function Textarea({ label, hint, erro, obrigatorio, className = '', ...rest }: TextareaProps) {
  return (
    <Field label={label} hint={hint} erro={erro} obrigatorio={obrigatorio}>
      {(id) => <textarea id={id} className={`textarea ${className}`} {...rest} />}
    </Field>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  children: ReactNode;
}

export function Select({ label, hint, erro, obrigatorio, className = '', children, ...rest }: SelectProps) {
  return (
    <Field label={label} hint={hint} erro={erro} obrigatorio={obrigatorio}>
      {(id) => (
        <select id={id} className={`select ${className}`} {...rest}>
          {children}
        </select>
      )}
    </Field>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="check" style={{ gap: 'var(--sp-3)' }}>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch__slider" />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
