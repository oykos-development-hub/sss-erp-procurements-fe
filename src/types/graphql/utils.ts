export interface Response<T> {
  status: string;
  message: string;
  total?: number;
  items: T[];
}

export interface SingularResponse<T> {
  status: string;
  message: string;
  item: T;
}
