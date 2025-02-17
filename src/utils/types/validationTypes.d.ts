export interface SchemaTypes<T> {
  isValid: boolean;
  value: T;
  message: string;
}
