import { vanillaRenderers } from '@jsonforms/vue-vanilla'
import { controlRenderers } from './controls'
import { layoutRenderers } from './layouts'

export const kongRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...vanillaRenderers,
]
