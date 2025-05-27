export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value != null && value !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return !value || value.length <= maxLength;
};

export const validateNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value: any): boolean => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateInteger = (value: any): boolean => {
  return Number.isInteger(Number(value));
};

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Validadores específicos del dominio
export const validateStock = (actual: number, maximo: number): boolean => {
  return actual >= 0 && actual <= maximo && maximo > 0;
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price < 1000000; // Límite razonable
};

export const validatePercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};