import { register } from '../helpers/case-register'

register({
  name: 'Custom Grouping',
  schema: {
    "type": "object",
    "properties": {
      "auth": {
        "type": "object",
        properties: {
          header_name: {
            type: 'string',
            "description": "If AI model requires authentication via Authorization or API key header, specify its name here."
          },
          header_value: {
            type: 'string',
            "description": "Specify the full auth header value for 'header_name', for example 'Bearer key' or just 'key'.",
          }
        },
        required: ['header_name', 'header_value']
      },
      model: {
        type: 'object',
        properties: {
          provider: {
            type: 'string',
            "one_of": [
              "openai",
              "azure",
              "anthropic",
              "cohere",
              "mistral",
              "llama2",
              "gemini",
              "bedrock",
              "huggingface"
            ],
            "description": "AI provider request format - Kong translates requests to and from the specified backend compatible formats."
          },
          name: {
            type: 'string',
            "description": "Model name to execute."
          },
          options: {
            type: 'object',
            "description": "Additional options to pass to the AI provider.",
            properties: {
              max_tokens: {
                type: 'integer',
                "description": "Defines the max_tokens, if using chat or completion models."
              },
              input_cost: {
                type: 'integer',
                "description": "Defines the cost per 1M tokens in your prompt."
              },
              huggingface: {
                type: 'object',
                properties: {
                  use_cache: {
                    type: 'boolean',
                    "description": "Use the cache layer on the inference API",
                  },
                  wait_for_model: {
                    type: 'boolean',
                    "description": "Wait for the model to be loaded before processing the request",
                  }
                },
              }
            },
          },
        },
        required: ['provider', 'name']
      }
    }
  },
  uischema: {
    "type": "VerticalLayout",
    elements: [
      {
        type: 'Group',
        label: 'Basic',
        elements: [
          {
            type: 'Control',
            label: 'Auth Header Name',
            scope: '#/properties/auth/properties/header_name'
          },
          {
            type: 'Control',
            label: 'Auth Header Value',
            scope: '#/properties/auth/properties/header_value'
          },
          {
            type: 'Control',
            label: 'Provider',
            scope: '#/properties/model/properties/provider'
          },
          {
            type: 'Control',
            label: 'Model Name',
            scope: '#/properties/model/properties/name'
          },
        ]
      },
      {
        type: 'Group',
        label: 'Advanced',
        elements: [
          {
            type: 'Control',
            label: 'Max Tokens',
            scope: '#/properties/model/properties/options/properties/max_tokens'
          },
          {
            type: 'Control',
            label: 'Input Cost',
            scope: '#/properties/model/properties/options/properties/input_cost'
          },
          {
            type: 'Control',
            label: 'Use Cache',
            scope: '#/properties/model/properties/options/properties/huggingface/properties/use_cache',
          },
          {
            type: 'Control',
            label: 'Wait for Model',
            scope: '#/properties/model/properties/options/properties/huggingface/properties/wait_for_model',
          }
        ]
      }
    ]
  },
  data: {
    auth: {
      header_name: 'Authorization',
      header_value: 'Bearer key'
    },
    model: {
      provider: 'openai',
      name: 'GPT-3',
      options: {
        max_tokens: 100,
        input_cost: 1
      }
    }
  }
})
