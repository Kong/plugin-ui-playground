import {
  default as MultiStringControlRenderer,
  tester as multiStringControlRendererTester,
} from './MultiStringControlRenderer.vue';
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
} from './KDateControlRenderer.vue';
import {
  default as dateTimeControlRenderer,
  tester as dateTimeControlRendererTester,
} from './DateTimeControlRenderer.vue';
import {
  default as timeControlRenderer,
  tester as timeControlRendererTester,
} from './TimeControlRenderer.vue';
import {
  default as redisPartialControlRenderer,
  tester as redisPartialControlRendererTester,
} from './KRedisPartialControlRenderer.vue';
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core';

import { default as KCheckBoxControlRenderer, tester as checkBoxTester } from './KCheckBoxRenderer.vue'
import { default as KToggleRenderer, tester as toggleTester } from './KToggleRenderer.vue'
import { default as KInputControlRenderer, tester as inputTester } from './KInputControlRenderer.vue'
import { default as KTextAreaControlRenderer, tester as textAreaTester } from './KTextAreaControlRenderer.vue'
import { default as KNumberControlRenderer, tester as numberTester } from './KNumberControlRenderer.vue'

export const controlRenderers: JsonFormsRendererRegistryEntry[] = [
  { tester: multiStringControlRendererTester, renderer: MultiStringControlRenderer },
  { tester: enumControlRendererTester, renderer: enumControlRendererEntry },
  { tester: oneOfEnumControlRendererTester, renderer: oneOfEnumControlRenderer },
  { tester: dateControlRendererTester, renderer: dateControlRenderer },
  { tester: dateTimeControlRendererTester, renderer: dateTimeControlRenderer },
  { tester: timeControlRendererTester, renderer: timeControlRenderer },
  { tester: redisPartialControlRendererTester, renderer: redisPartialControlRenderer },

  { tester: checkBoxTester, renderer: KCheckBoxControlRenderer },
  { tester: toggleTester, renderer: KToggleRenderer },
  { tester: inputTester, renderer: KInputControlRenderer },
  { tester: textAreaTester, renderer: KTextAreaControlRenderer },
  { tester: numberTester, renderer: KNumberControlRenderer },
]
