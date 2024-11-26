import { ObjectSchema } from 'joi';
import { Payload } from './types/expressTypes';
import { SchemaTypes } from './types/validationTypes';
declare const _default: <T>(payload: Payload, schemaKeys: ObjectSchema<any>) => SchemaTypes<T>;
export default _default;
