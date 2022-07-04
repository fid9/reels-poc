export interface ApiResponse<T> {
  statusCode?: number;
  type?: 'json' | 'html';
  headers?: {
    [header: string]: boolean | number | string;
  };
  body: T;
}
