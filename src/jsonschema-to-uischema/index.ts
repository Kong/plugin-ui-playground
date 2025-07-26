import { JsonSchema } from "@jsonforms/core";

export const flattenJSONSchema = (schema: JsonSchema, path?: string): JsonSchema => {
  if (!schema.type) {
    throw new Error('No type defined');
  }

  if (schema.type === 'object') {
    return {
      type: 'object',
      properties: Object.keys(schema.properties!).reduce((acc, key) => {
        const property = schema.properties![key];
        const k = path ? `${path}.${key}` : key;
        return {
          ...acc,
          [k]: flattenJSONSchema(property, k)
        };
      }, {})
    };
  } else {
    return schema;
  }
}
