<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <KInput
      v-model="control.data"
      :label="control.label"
      type="number"
      :disabled="!control.enabled"
      :placeholder="appliedOptions.placeholder"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :label-attributes="control.schema.description ? {
        info: control.schema.description,
        tooltipAttributes: { maxWidth: '400' },
      } : undefined"
      :required="control.required"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  // JsonFormsRendererRegistryEntry,
  rankWith,
  isNumberControl,
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
  name: 'KNumberControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(useJsonFormsControl(props), (target) =>
      target.value === '' ? undefined : Number(target.value)
    );
  },
  computed: {
    step(): number {
      const options: any = this.appliedOptions;
      return options.step ?? 0.1;
    },
  },
});

export default controlRenderer;

// export const entry: JsonFormsRendererRegistryEntry = {
//   renderer: controlRenderer,
//   tester: rankWith(1, isNumberControl),
// };
export const tester = rankWith(1, isNumberControl)
</script>
