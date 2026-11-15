/**
 * Build-time deployment settings. Nothing here is a business fact.
 *
 * PUBLIC_FORM_ENDPOINT  - URL that accepts the lead form as JSON (POST).
 *                         When empty the form runs in clearly labelled demo mode.
 * PUBLIC_OPERATOR_NAME  - legal name of the personal-data operator (required
 *                         together with PUBLIC_FORM_ENDPOINT).
 * PUBLIC_OPERATOR_CONTACT - contact for personal-data requests.
 */
export interface FormSettings {
  endpoint: string | null;
  operatorName: string | null;
  operatorContact: string | null;
}

export function getFormSettings(): FormSettings {
  const env = import.meta.env;
  const endpoint = (env.PUBLIC_FORM_ENDPOINT as string | undefined)?.trim() || null;
  const operatorName = (env.PUBLIC_OPERATOR_NAME as string | undefined)?.trim() || null;
  const operatorContact = (env.PUBLIC_OPERATOR_CONTACT as string | undefined)?.trim() || null;
  if (endpoint && (!operatorName || !operatorContact)) {
    throw new Error(
      'PUBLIC_FORM_ENDPOINT is set, so PUBLIC_OPERATOR_NAME and PUBLIC_OPERATOR_CONTACT are required ' +
        'for the privacy policy. Refusing to build a live form without operator details.',
    );
  }
  return { endpoint, operatorName, operatorContact };
}

/** Prefixes an internal path with the configured base (for sub-path hosting). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
