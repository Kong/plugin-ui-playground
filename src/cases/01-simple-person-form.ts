import { register } from '../helpers/case-register'

register({
  name: 'Simple Person Form',
  schema: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name'
      },
      lastName: {
        type: 'string',
        title: 'Last Name'
      },
      age: {
        type: 'integer',
        title: 'Age',
        minimum: 0
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email'
      }
    },
    required: ['firstName', 'lastName', 'email']
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/firstName'
      },
      {
        type: 'Control',
        scope: '#/properties/lastName'
      },
      {
        type: 'Control',
        scope: '#/properties/age'
      },
      {
        type: 'Control',
        scope: '#/properties/email'
      }
    ]
  },
  data: {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john.doe@example.com'
  }
})
