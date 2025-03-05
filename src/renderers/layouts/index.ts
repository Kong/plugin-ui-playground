import {
  default as EntitySectionRenderer,
  tester as entitySectionRendererTester,
} from './KEntitySectionRenderer.vue';
import {
  default as GroupRenderer,
  tester as groupRendererTester,
} from './KGroupRenderer.vue';
import {
  default as EntityCategorizationRenderer,
  tester as entityCategorizationRendererTester,
} from './KCategorizationRenderer.vue';

export const layoutRenderers = [
  { tester: entitySectionRendererTester, renderer: EntitySectionRenderer },
  { tester: groupRendererTester, renderer: GroupRenderer },
  { tester: entityCategorizationRendererTester, renderer: EntityCategorizationRenderer },
];
