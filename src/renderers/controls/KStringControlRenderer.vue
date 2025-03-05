<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <KInput
      :value="control.data"
      :label="control.label"
      :disabled="!control.enabled"
      :placeholder="appliedOptions.placeholder"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :label-attributes="control.schema.description ? {
        info: control.schema.description,
        tooltipAttributes: { maxWidth: '400' },
      } : undefined"
      required
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  // JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  RankedTester,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue';
import ControlWrapper from './ControlWrapper.vue';
import { useVanillaControl } from '../../util';

const controlRenderer = defineComponent({
  name: 'KStringControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const res = useVanillaControl(
      useJsonFormsControl(props),
      (target) => target.value || undefined
    );

    console.log('string', res, props)


    return res
  },
});

// controlRenderer.tester = rankWith(1, isStringControl)

export default controlRenderer;

// export const entry: JsonFormsRendererRegistryEntry = {
//   renderer: controlRenderer,
//   tester: rankWith(1, isStringControl),
// };

export const tester: RankedTester = rankWith(1, isStringControl)
</script>
