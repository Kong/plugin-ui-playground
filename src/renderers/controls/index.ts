export { default as ControlWrapper } from './ControlWrapper.vue';
export { default as StringControlRenderer } from './KStringControlRenderer.vue';
export { default as MultiStringControlRenderer } from './MultiStringControlRenderer.vue';
export { default as NumberControlRenderer } from './KNumberControlRenderer.vue';
export { default as IntegerControlRenderer } from './KIntegerControlRenderer.vue';
export { default as EnumControlRenderer } from './KEnumControlRenderer.vue';
export { default as oneOfEnumControlRenderer } from './EnumOneOfControlRenderer.vue';
export { default as DateControlRenderer } from './DateControlRenderer.vue';
export { default as DateTimeControlRenderer } from './DateTimeControlRenderer.vue';
export { default as TimeControlRenderer } from './TimeControlRenderer.vue';
export { default as BooleanControlRenderer } from './KBooleanControlRenderer.vue';

import { entry as stringControlRendererEntry } from './KStringControlRenderer.vue';
import { entry as multiStringControlRendererEntry } from './MultiStringControlRenderer.vue';
import { entry as numberControlRendererEntry } from './KNumberControlRenderer.vue';
import { entry as integerControlRendererEntry } from './KIntegerControlRenderer.vue';
import { entry as enumControlRendererEntry } from './KEnumControlRenderer.vue';
import { entry as oneOfEnumControlRendererEntry } from './EnumOneOfControlRenderer.vue';
import { entry as dateControlRendererEntry } from './DateControlRenderer.vue';
import { entry as dateTimeControlRendererEntry } from './DateTimeControlRenderer.vue';
import { entry as timeControlRendererEntry } from './TimeControlRenderer.vue';
import { entry as booleanControlRendererEntry } from './KBooleanControlRenderer.vue';

export const controlRenderers = [
  stringControlRendererEntry,
  multiStringControlRendererEntry,
  numberControlRendererEntry,
  integerControlRendererEntry,
  enumControlRendererEntry,
  oneOfEnumControlRendererEntry,
  dateControlRendererEntry,
  dateTimeControlRendererEntry,
  timeControlRendererEntry,
  booleanControlRendererEntry,
];
