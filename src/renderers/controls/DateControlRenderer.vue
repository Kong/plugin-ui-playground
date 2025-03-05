<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div style="width: 100%;">
      <KLabel
        :for="control.id + '-input'"
        :required="control.required"
      >
        {{ control.label }}
      </KLabel>
      <KDateTimePicker
        :id="control.id + '-input'"
        clear-button
        :placeholder="appliedOptions.placeholder"
        mode="date"
        :range="false"
        @change="console.log"
      />
    </div>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  // JsonFormsRendererRegistryEntry,
  rankWith,
  isDateControl,
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
  name: 'DateControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(
      useJsonFormsControl(props),
      (target) => target.value || undefined
    );
  },
});

export default controlRenderer;

// export const entry: JsonFormsRendererRegistryEntry = {
//   renderer: controlRenderer,
//   tester: rankWith(2, isDateControl),
// };

export const tester = rankWith(2, isDateControl)
</script>
