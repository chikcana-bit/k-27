/**
 * Lead form behaviour: inline validation, loading/success/error states.
 *
 * Demo mode (no data-endpoint): nothing is sent anywhere. The visitor is told
 * so explicitly and gets the composed request text to copy and deliver through
 * the business's phone (or its e-mail when the business's own website states one), so the input is never silently
 * discarded.
 */
export interface LeadValues {
  name: string;
  contact: string;
  service: string;
  message: string;
  consent: boolean;
}

export type LeadErrors = Partial<Record<keyof LeadValues, string>>;

const PHONE = /^\+?[\d\s()-]{10,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const HANDLE = /^@[\w.]{3,}$/;

export function validateLead(values: LeadValues): LeadErrors {
  const errors: LeadErrors = {};
  const name = values.name.trim();
  const contact = values.contact.trim();
  if (name.length < 2) errors.name = 'Укажите, как к вам обращаться (минимум 2 символа).';
  if (!contact) {
    errors.contact = 'Укажите телефон, e-mail или ник в мессенджере, чтобы с вами могли связаться.';
  } else if (!PHONE.test(contact) && !EMAIL.test(contact) && !HANDLE.test(contact)) {
    errors.contact = 'Проверьте формат: телефон (+7 900 000-00-00), e-mail или @ник.';
  } else if (PHONE.test(contact) && contact.replace(/\D/g, '').length < 10) {
    errors.contact = 'В номере телефона должно быть не меньше 10 цифр.';
  }
  if (values.message.length > 1000) errors.message = 'Сократите сообщение до 1000 символов.';
  if (!values.consent) errors.consent = 'Нужно согласие на обработку персональных данных.';
  return errors;
}

export function composeLeadText(values: LeadValues, businessName: string): string {
  const lines = [
    `Заявка для «${businessName}»`,
    `Имя: ${values.name.trim()}`,
    `Контакт: ${values.contact.trim()}`,
  ];
  if (values.service) lines.push(`Услуга: ${values.service}`);
  if (values.message.trim()) lines.push(`Комментарий: ${values.message.trim()}`);
  return lines.join('\n');
}

function readValues(form: HTMLFormElement): LeadValues {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? ''),
    contact: String(data.get('contact') ?? ''),
    service: String(data.get('service') ?? ''),
    message: String(data.get('message') ?? ''),
    consent: data.get('consent') === 'on',
  };
}

function showErrors(form: HTMLFormElement, errors: LeadErrors): void {
  (['name', 'contact', 'message', 'consent'] as const).forEach((key) => {
    const control = form.elements.namedItem(key) as HTMLElement | null;
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);
    if (!control || !slot) return;
    const message = errors[key];
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    slot.textContent = message ?? '';
    slot.hidden = !message;
  });
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  return node;
}

export function initLeadForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const submitLabel = submit?.querySelector<HTMLElement>('[data-submit-label]');
  const endpoint = form.dataset.endpoint || '';
  const business = form.dataset.business ?? '';
  const email = form.dataset.email || '';
  const phone = form.dataset.phone || '';
  const phoneLabel = form.dataset.phoneLabel || '';
  const idleLabel = submitLabel?.textContent ?? '';
  let touched = false;

  const setStatus = (kind: 'success' | 'error' | 'demo', title: string, body: Node[]): void => {
    if (!status) return;
    status.dataset.kind = kind;
    status.replaceChildren(el('strong', title), ...body);
    status.hidden = false;
    status.focus();
  };

  form.addEventListener('input', () => {
    if (touched) showErrors(form, validateLead(readValues(form)));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    touched = true;
    if (status) status.hidden = true;
    const values = readValues(form);
    const errors = validateLead(values);
    showErrors(form, errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    // Honeypot: bots fill the hidden field; humans never see it.
    if (new FormData(form).get('website')) return;

    const text = composeLeadText(values, business);

    if (!endpoint) {
      const pre = el('pre', text);
      const actions = el('div');
      actions.className = 'cluster';
      const copy = el('button', 'Скопировать текст');
      copy.type = 'button';
      copy.className = 'btn btn--small';
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text);
          copy.textContent = 'Скопировано';
        } catch {
          copy.textContent = 'Выделите текст и скопируйте вручную';
        }
      });
      actions.append(copy);
      if (email) {
        const mail = el('a', 'Открыть письмо');
        mail.className = 'btn btn--small';
        mail.href = `mailto:${email}?subject=${encodeURIComponent(`Заявка с сайта: ${business}`)}&body=${encodeURIComponent(text)}`;
        actions.append(mail);
      }
      if (phone) {
        const call = el('a', `Позвонить: ${phoneLabel}`);
        call.className = 'btn btn--small';
        call.href = `tel:${phone}`;
        actions.append(call);
      }
      setStatus('demo', 'Демо-режим: заявка никуда не отправлена', [
        el(
          'p',
          'Форма ещё не подключена к приёму заявок. Чтобы обращение дошло, передайте этот текст напрямую:',
        ),
        pre,
        actions,
      ]);
      return;
    }

    submit?.setAttribute('aria-busy', 'true');
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Отправляем…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, business, page: window.location.href }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      touched = false;
      setStatus('success', 'Заявка отправлена', [
        el('p', 'Спасибо! С вами свяжутся по указанному контакту.'),
      ]);
    } catch {
      setStatus('error', 'Не удалось отправить заявку', [
        el(
          'p',
          'Проверьте подключение к интернету и попробуйте ещё раз. Введённые данные сохранены в форме.',
        ),
      ]);
    } finally {
      submit?.removeAttribute('aria-busy');
      if (submit) submit.disabled = false;
      if (submitLabel) submitLabel.textContent = idleLabel;
    }
  });
}

if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach(initLeadForm);
}
