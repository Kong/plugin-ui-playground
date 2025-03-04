import { register } from '../helpers/case-register'

register({
  name: 'Categorization',
  schema: {
    "type": "object",
    "properties": {
      client_id: {
        type: 'array',
        "description": "The client id(s) that the plugin uses when it calls authenticated endpoints on the identity provider.",
        items: {
          type: 'string'
        }
      },
      scopes_claim: {
        type: 'array',
        "description": "The claim that contains the scopes. If multiple values are set, it means the claim is inside a nested object of the token payload.",
        items: {
          type: 'string'
        }
      },
      anonymous: {
        type: 'string',
        "description": "An optional string (consumer UUID or username) value that functions as an “anonymous” consumer if authentication fails. If empty (default null), requests that fail authentication will return a `4xx` HTTP status code. This value must refer to the consumer `id` or `username` attribute, and **not** its `custom_id`."
      }
    }
  },
  uischema: {
    "type": "Categorization",
    elements: [
      {
        type: 'Category',
        label: 'Common',
        elements: [
          {
            type: 'Control',
            label: 'Client ID',
            scope: '#/properties/client_id'
          }
        ]
      },
      {
        type: 'Category',
        label: 'Authorization',
        elements: [
          {
            type: 'Control',
            label: 'Scopes Claim',
            scope: '#/properties/scopes_claim'
          },
        ]
      },
      {
        type: 'Category',
        label: 'Advanced',
        elements: [
          {
            type: 'Control',
            label: 'Anonymous',
            scope: '#/properties/anonymous'
          }
        ]
      }
    ]
  },
  data: {

  }
})
