export { default as EntitySection } from './KEntitySectionRenderer.vue';
export { default as Group } from './KGroupRenderer.vue';
export { default as Categorization } from './KCategorizationRenderer.vue';

import { entry as entitySectionRendererEntry } from './KEntitySectionRenderer.vue';
import { entry as entityGroupRendererEntry } from './KGroupRenderer.vue';
import { entry as entityCategorizationRendererEntry } from './KCategorizationRenderer.vue';

export const layoutRenderers = [
  entitySectionRendererEntry,
  entityGroupRendererEntry,
  entityCategorizationRendererEntry,
];
