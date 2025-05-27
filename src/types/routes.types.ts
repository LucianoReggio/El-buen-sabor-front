
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface PageMeta {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}