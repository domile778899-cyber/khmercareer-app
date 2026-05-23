import { useState, useCallback } from 'react';

export interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string;
  matchField?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+]{9,15}$/;

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (field: string, value: string, rules: ValidationRules, _allValues?: Record<string, string>): string | undefined => {
      if (rules.required && (!value || value.trim().length === 0)) {
        return `${formatFieldName(field)} is required`;
      }

      if (value && rules.minLength !== undefined && value.length < rules.minLength) {
        return `${formatFieldName(field)} must be at least ${rules.minLength} characters`;
      }

      if (value && rules.maxLength !== undefined && value.length > rules.maxLength) {
        return `${formatFieldName(field)} must be at most ${rules.maxLength} characters`;
      }

      if (value && rules.email && !EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }

      if (value && rules.phone && !PHONE_REGEX.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number (9-15 digits)';
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        return `${formatFieldName(field)} format is invalid`;
      }

      if (rules.match !== undefined && value !== rules.match) {
        return `${formatFieldName(field)} does not match ${rules.matchField || 'the other field'}`;
      }

      return undefined;
    },
    []
  );

  const validate = useCallback(
    (field: string, value: string, rules: ValidationRules, allValues?: Record<string, string>) => {
      const error = validateField(field, value, rules, allValues);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
      return error;
    },
    [validateField]
  );

  const validateAll = useCallback(
    (fields: { name: string; value: string; rules: ValidationRules }[]): Record<string, string> => {
      const allValues: Record<string, string> = {};
      fields.forEach((f) => {
        allValues[f.name] = f.value;
      });

      const newErrors: Record<string, string> = {};
      fields.forEach((f) => {
        const error = validateField(f.name, f.value, f.rules, allValues);
        if (error) {
          newErrors[f.name] = error;
        }
      });

      setErrors(newErrors);
      return newErrors;
    },
    [validateField]
  );

  const isValid = useCallback(() => Object.keys(errors).length === 0, [errors]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const touchField = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  return {
    errors,
    touched,
    validate,
    validateAll,
    isValid,
    setTouched,
    clearError,
    clearAllErrors,
    touchField,
  };
}

function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
