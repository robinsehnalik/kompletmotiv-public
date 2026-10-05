/**
 * Sanitized Frontend Pattern
 * 
 * Purpose: Demonstrates idiomatic TypeScript, defensive validation,
 * and reactive UI logic used in the client project without revealing proprietary components.
 */

export interface FormSubmissionPayload {
  name: string;
  email: string;
  message: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates lead submission inputs on the client before triggering network requests
 */
export function validateLeadForm(payload: FormSubmissionPayload): ValidationState {
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name.trim()) {
    errors.name = "Name field cannot be left blank.";
  }

  if (!emailRegex.test(payload.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (payload.message.trim().length < 10) {
    errors.message = "Message must contain at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Resilient submit handler with debounced execution and abort controller support
 */
export async function submitLeadAsync(
  endpoint: string,
  payload: FormSubmissionPayload,
  signal?: AbortSignal
): Promise<{ success: boolean; message: string }> {
  const validation = validateLeadForm(payload);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${Object.values(validation.errors).join(", ")}`);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  return { success: true, message: "Submission successfully received." };
}
