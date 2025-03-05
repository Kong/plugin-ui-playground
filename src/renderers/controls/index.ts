import {
  default as StringControlRenderer,
  tester as stringControlRendererTester,
} from './KStringControlRenderer.vue';
import {
  default as MultiStringControlRenderer,
  tester as multiStringControlRendererTester,
} from './MultiStringControlRenderer.vue';
import {
  default as numberControlRenderer,
  tester as numberControlRendererTester,
} from './KNumberControlRenderer.vue';
import {
  default as integerControlRenderer,
  tester as integerControlRendererTester,
} from './KIntegerControlRenderer.vue';
import {
  default as enumControlRendererEntry,
  tester as enumControlRendererTester,
} from './KEnumControlRenderer.vue';
import {
  default as oneOfEnumControlRenderer,
  tester as oneOfEnumControlRendererTester,
} from './EnumOneOfControlRenderer.vue';
import {
  default as dateControlRenderer,
  tester as dateControlRendererTester,
} from './DateControlRenderer.vue';
import {
  default as dateTimeControlRenderer,
  tester as dateTimeControlRendererTester,
} from './DateTimeControlRenderer.vue';
import {
  default as timeControlRenderer,
  tester as timeControlRendererTester,
} from './TimeControlRenderer.vue';
import {
  default as booleanControlRenderer,
  tester as booleanControlRendererTester,
} from './KBooleanControlRenderer.vue';
import {
  default as redisPartialControlRenderer,
  tester as redisPartialControlRendererTester,
} from './KRedisPartialControlRenderer.vue';
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';

export const controlRenderers: JsonFormsRendererRegistryEntry[] = [
  { tester: stringControlRendererTester, renderer: StringControlRenderer },
  { tester: multiStringControlRendererTester, renderer: MultiStringControlRenderer },
  { tester: numberControlRendererTester, renderer: numberControlRenderer },
  { tester: integerControlRendererTester, renderer: integerControlRenderer },
  { tester: enumControlRendererTester, renderer: enumControlRendererEntry },
  { tester: oneOfEnumControlRendererTester, renderer: oneOfEnumControlRenderer },
  { tester: dateControlRendererTester, renderer: dateControlRenderer },
  { tester: dateTimeControlRendererTester, renderer: dateTimeControlRenderer },
  { tester: timeControlRendererTester, renderer: timeControlRenderer },
  { tester: booleanControlRendererTester, renderer: booleanControlRenderer },
  { tester: redisPartialControlRendererTester, renderer: redisPartialControlRenderer },
];
