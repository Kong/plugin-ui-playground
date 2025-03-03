import { register } from '../helpers/case-register'

register({
  name: 'Product Configuration',
  schema: {
    type: 'object',
    properties: {
      productName: {
        type: 'string',
        title: 'Product Name'
      },
      category: {
        type: 'string',
        title: 'Category',
        enum: ['Electronics', 'Clothing', 'Food', 'Books', 'Other']
      },
      price: {
        type: 'number',
        title: 'Price',
        minimum: 0
      },
      inStock: {
        type: 'boolean',
        title: 'In Stock'
      },
      description: {
        type: 'string',
        title: 'Description'
      },
      tags: {
        type: 'array',
        title: 'Tags',
        items: {
          type: 'string'
        }
      }
    },
    required: ['productName', 'category', 'price']
  },
  uischema: {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/productName'
      },
      {
        type: 'Control',
        scope: '#/properties/category'
      },
      {
        type: 'Control',
        scope: '#/properties/price'
      },
      {
        type: 'Control',
        scope: '#/properties/inStock'
      },
      {
        type: 'Control',
        scope: '#/properties/description',
        options: {
          multi: true
        }
      },
      {
        type: 'Control',
        scope: '#/properties/tags'
      }
    ]
  },
  data: {
    productName: 'Smartphone',
    category: 'Electronics',
    price: 599.99,
    inStock: true,
    description: 'A high-end smartphone with the latest features.',
    tags: ['tech', 'mobile', 'gadget']
  }
})
