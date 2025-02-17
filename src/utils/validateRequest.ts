import { ObjectSchema } from 'joi';

import { Payload } from './types/expressTypes';
import { SchemaTypes } from './types/validationTypes';

export default <T>(
  payload: Payload,
  schemaKeys: ObjectSchema<any>,
): SchemaTypes<T> => {
  const { value, error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el) => el.message).join('\n');
    return <SchemaTypes<T>>{
      isValid: false,
      message,
    };
  }
  return <SchemaTypes<T>>{ isValid: true, value };
};
