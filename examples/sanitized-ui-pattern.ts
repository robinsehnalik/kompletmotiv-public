/**
 * Sanitized Lead Interaction & Constraint Validation Pattern
 * 
 * Authentic pattern extracted from stavimesmotivem.cz (Komplet Motiv s.r.o.)
 * Demonstrates zero-dependency HTML5 DOM constraint validation, focus management
 * for accessibility, and resilient asynchronous dispatch with auto-dismissing feedback.
 */

export interface ContactInquiryPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Validates form elements using native HTML5 Constraint Validation API.
 * Ensures the first invalid input receives immediate focus for screen reader & keyboard navigation.
 */
export function validateFormElements(form: HTMLFormElement): boolean {
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    const firstInvalid = form.querySelector<HTMLElement>(":invalid");
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return false;
  }

  return true;
}

/**
 * Serializes form data and sends an asynchronous lead submission to the API endpoint.
 * Features abort controller timeout and structured response handling.
 */
export async function dispatchInquiryAsync(
  form: HTMLFormElement,
  endpoint: string = "/api/submit",
  timeoutMs: number = 8000
): Promise<SubmissionResponse> {
  if (!validateFormElements(form)) {
    throw new Error("Form validation failed. Please check required fields.");
  }

  const formData = new FormData(form);
  const payload: ContactInquiryPayload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    phone: formData.get("phone") ? String(formData.get("phone")).trim() : undefined,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        resJson.error || `Request failed with status code ${response.status}`
      );
    }

    form.reset();
    form.classList.remove("was-validated");

    return {
      success: true,
      message: "Děkujeme, vaše zpráva byla úspěšně odeslána!",
    };
  } finally {
    clearTimeout(timer);
  }
}
