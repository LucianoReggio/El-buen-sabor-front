import type { PaginationParams } from "./common.types";

export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface TableFilters {
  search?: string;
  filters: Record<string, any>;
  pagination: PaginationParams;
}