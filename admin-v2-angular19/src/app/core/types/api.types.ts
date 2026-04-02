export type ApiResponse<Type = null> = {
  status: 'success' | 'error';
  record: Type;
  meta: Meta;
  message: string;
};

export type Meta = {
  page: number;
  last_page: number;
  from: number;
  to: number;
  limit: number;
  total: number;
  has_more_pages: boolean;
  is_first_page: boolean;
};

export type ErrorResponse = {
  message: string;
  error?: {
    code: string;
    message: string;
    errors: any | any[];
    html: string;
  };
};

export interface Paginator {
  id?: number;
  page: number;
  last_page: number;
  from: number;
  to: number;
  limit: number;
  total: number;
  has_more_pages: boolean;
  is_first_page: boolean;
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
}
