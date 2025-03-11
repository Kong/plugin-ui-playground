import { register } from '../helpers/case-register'

register({
  name: 'Entity Section',
  description: 'This is how we customize the layout of Kong\'s style form section. See the `KEntitySection` field in ui-schema tab.',
  schema: {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 3,
      },
      "type": {
        "type": "string",
        "enum": [
          "redis-ce",
          "redis-ee",
        ]
      },
    },
    "required": [
      "name",
      "type"
    ]
  },
  uischema: {
    "type": "VerticalLayout",
    "elements": [
      {
        type: 'KEntitySection',
        label: 'Redis type',
        description: 'Both Enterprise and Open Source plugins support Redis. Enterprise plugins can connect to a standalone Redis instance (host/port), Cluster, or Sentinel, while Open Source plugins support only a simplified host/port configuration.',
        elements: [
          {
            type: 'Control',
            label: 'Redis type',
            scope: '#/properties/type',
            options: {
              format: 'select',
              enum: [
                'Host/port (Open Source)',
                'Host/port (Enterprise)',
                'Cluster',
                'Sentinel',
              ],
            },
          }
        ]
      },
      {
        type: 'KEntitySection',
        label: 'General information',
        description: 'Name your Redis configuration.',
        elements: [
          {
            type: 'Control',
            label: 'Name',
            scope: '#/properties/name',
          }
        ]
      },
    ]
  },
  data: {
    "name": "Redis",
    "type": "redis-ce",
  }
})
