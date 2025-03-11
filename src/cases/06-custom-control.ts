import { register } from '../helpers/case-register'

register({
  name: 'Custom Control',
  description: 'We can create custom controls to handle complex UI component. See the `KRedisPartialControl` field in ui-schema tab.',
  schema: {
    "type": "object",
    "properties": {
      name: {
        type: 'string'
      },
      redis: {
        type: 'object',
        properties: {
          host: {
            type: 'string'
          },
          port: {
            type: 'number'
          }
        }
      },
      partials: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        "type": "Control",
        scope: '#/properties/name'
      },
      {
        type: 'KRedisPartialControl',
        scope: '#/properties/redis',
        options: {
          redisScope: '#/properties/redis',
          partialsScope: '#/properties/partials'
        }
      }
    ]
  },
  data: {

  }
})
