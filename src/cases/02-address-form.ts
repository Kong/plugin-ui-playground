import { register } from '../helpers/case-register'

register({
  name: 'Address Form',
  schema: {
    type: 'object',
    properties: {
      street: {
        type: 'string',
        title: 'Street'
      },
      city: {
        type: 'string',
        title: 'City'
      },
      state: {
        type: 'string',
        title: 'State'
      },
      zipCode: {
        type: 'string',
        title: 'Zip Code',
        pattern: '^[0-9]{5}(-[0-9]{4})?$'
      },
      country: {
        type: 'string',
        title: 'Country',
        enum: ['USA', 'Canada', 'Mexico', 'Other']
      }
    },
    required: ['street', 'city', 'state', 'zipCode', 'country']
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/street'
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/city'
          },
          {
            type: 'Control',
            scope: '#/properties/state'
          }
        ]
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/zipCode'
          },
          {
            type: 'Control',
            scope: '#/properties/country'
          }
        ]
      }
    ]
  },
  data: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'USA'
  }
})
