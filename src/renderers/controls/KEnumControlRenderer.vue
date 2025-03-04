<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <KSelect
      :id="control.id + '-input'"
      :value="control.data"
      :label="control.label"
      :required="config.required"
      :label-attributes="control.schema.description ? {
        info: control.schema.description,
        tooltipAttributes: { maxWidth: '400' },
      } : undefined"
      :items="control.options"
      @change="onChange"
    />
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isEnumControl,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  rendererProps,
  useJsonFormsEnumControl,
  RendererProps,
} from '@jsonforms/vue';
import ControlWrapper from './ControlWrapper.vue';
import { useVanillaControl } from '../../util';

const controlRenderer = defineComponent({
  name: 'KEnumControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const res = useVanillaControl(useJsonFormsEnumControl(props), (target) =>
      target.selectedIndex === 0 ? undefined : target.value
    );
    console.log('res', res)
    return res
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isEnumControl),
};
</script>
