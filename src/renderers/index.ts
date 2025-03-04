import { vanillaRenderers } from '@jsonforms/vue-vanilla'
import { controlRenderers } from './controls'
import { layoutRenderers } from './layouts'
import { arrayRenderers } from './array'

export const kongRenderers = [
  ...arrayRenderers,
  ...controlRenderers,
  ...layoutRenderers,
  ...vanillaRenderers,
]
