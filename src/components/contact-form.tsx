"use client";

import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { profile } from "@/lib/portfolio";

type FormValues = {
  name: string;
  email: string;
  message: string;
  website: string;
};
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = {
  kind: "success" | "error" | "fallback";
  message: string;
} | null;

const emptyValues: FormValues = {
  name: "",
  email: "",
  message: "",
  website: "",
};

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2)
    errors.name = "Please enter at least 2 characters.";
  else if (values.name.trim().length > 100)
    errors.name = "Please keep your name under 100 characters.";

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ||
    values.email.trim().length > 254
  ) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.message.trim().length < 20)
    errors.message = "Tell me a little more — at least 20 characters.";
  else if (values.message.trim().length > 5000)
    errors.message = "Please keep your message under 5,000 characters.";

  return errors;
}

export function ContactForm() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>(null);
  const [pending, setPending] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "website")
      setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatus(null);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      formRef.current
        ?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${firstError}"]`,
        )
        ?.focus();
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15000),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !result.success) {
        if (response.status === 503 && profile.email) {
          setStatus({
            kind: "fallback",
            message:
              "Your message is ready. Open your email app below to review and send it.",
          });
          return;
        }
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus({
          kind: "error",
          message:
            result.error || "Your message could not be sent. Please try again.",
        });
        return;
      }

      setValues(emptyValues);
      setStatus({
        kind: "success",
        message:
          "Message sent. Thanks for reaching out — I’ll be in touch soon.",
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "The connection timed out or is unavailable. Please try again later.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Send a message"
      aria-busy={pending}
    >
      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${formId}-name`}>
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-name`}
            className="form-input"
            name="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            required
            minLength={2}
            maxLength={100}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            disabled={pending}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="form-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-email`}>
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-email`}
            className="form-input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@company.com"
            required
            maxLength={254}
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? `${formId}-email-error` : undefined
            }
            disabled={pending}
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className="form-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={`${formId}-message`}>
          What are you working on? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          className="form-input"
          name="message"
          placeholder="A little about your project, your team, or your next big idea…"
          rows={5}
          required
          minLength={20}
          maxLength={5000}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${formId}-message-hint${errors.message ? ` ${formId}-message-error` : ""}`}
          disabled={pending}
        />
        <p id={`${formId}-message-hint`} className="form-hint">
          20–5,000 characters. All fields are required.
        </p>
        {errors.message && (
          <p id={`${formId}-message-error`} className="form-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Leave this field empty</label>
        <input
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>
      <button
        className="button button-primary form-submit"
        type="submit"
        disabled={pending}
      >
        {pending ? (
          <>
            Sending message{" "}
            <LoaderCircle
              size={17}
              className="animate-spin"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            Send message <ArrowUpRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
      <div aria-live="polite" aria-atomic="true">
        {status && (
          <p
            className={`form-status form-status-${status.kind}`}
            role={status.kind === "error" ? "alert" : "status"}
          >
            {status.kind === "success" && (
              <CheckCircle2 size={17} aria-hidden="true" />
            )}
            {status.message}
          </p>
        )}
      </div>
      {status && status.kind !== "success" && profile.email && (
        <a
          className="email-fallback text-link"
          href={`mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio inquiry from ${values.name.trim()}`)}&body=${encodeURIComponent(`Name: ${values.name.trim()}\nReply to: ${values.email.trim()}\n\n${values.message.trim()}`)}`}
        >
          Open this message in your email app{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </form>
  );
}
