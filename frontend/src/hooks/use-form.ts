import { useState, useCallback } from "react";

type ValidationFn<T> = (value: string, formData?: T) => string;

interface UseFormOptions<T> {
  validations?: {
    [K in keyof T]?: ValidationFn<T>;
  };
}

interface UseFormReturn<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  setValue: (field: keyof T, value: string) => void;
  send: () => { data: T | null; errors: Partial<Record<keyof T, string>> };
}

export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T> = {}): UseFormReturn<T> {
  const [data, setData] = useState<T>({} as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = useCallback((field: keyof T, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (options.validations?.[field as keyof T]) {
      const validationFn = options.validations[field as keyof T]!;
      const currentData = { ...data, [field]: value };
      const error = validationFn(value, currentData);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [options.validations, data]);

  const send = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasErrors = false;

    if (options.validations) {
      for (const field in options.validations) {
        const validationFn = options.validations[field]!;
        const value = (data[field as keyof T] ?? "") as string;
        const error = validationFn(value, data);
        if (error) {
          newErrors[field as keyof T] = error;
          hasErrors = true;
        }
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      return { data: null, errors: newErrors };
    }

    return { data, errors: {} };
  }, [data, options.validations]);

  return {
    data,
    errors,
    setValue,
    send,
  };
}

export type { UseFormOptions, UseFormReturn };
