<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
  <KCard
    class="redis-config-card"
    data-testid="redis-config-card"
    title="Redis Configuration"
  >
    <div
      class="redis-config-radio-group"
      data-testid="redis-config-radio-group"
    >
      <KRadio
        v-model="usePartial"
        card
        card-orientation="horizontal"
        data-testid="shared-redis-config-radio"
        description="Select an existing shared Redis configuration or create a new one. Any updates to this configuration will automatically apply to all associated plugins."
        label="Use shared configuration"
        :selected-value="true"
      >
        <KBadge appearance="success">
          Recommended
        </KBadge>
      </KRadio>
      <KRadio
        v-model="usePartial"
        card
        card-orientation="horizontal"
        data-testid="dedicated-redis-config-radio"
        description="Create a Redis configuration exclusively for this plugin, with settings that won’t impact other plugins."
        label="Use dedicated configuration"
        :selected-value="false"
      />
    </div>

    <KSelect
      v-if="usePartial"
      :items="[
        { label: 'Partial A', value: 'partial-a', selected: partialValue === 'partial-a' },
        { label: 'Partial B', value: 'partial-b', selected: partialValue === 'partial-b' },
      ]"
      @change="handlePickerChange"
    />

    <dispatch-renderer
      v-if="!usePartial"
      :schema="control.schema"
      :uischema="childUiSchema"
      :path="control.path"
      :enabled="control.enabled"
      :renderers="control.renderers"
      :cells="control.cells"
    />
  </KCard>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  findUISchema,
  // JsonFormsRendererRegistryEntry,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { computed, defineComponent, ref, watch } from 'vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
  DispatchRenderer,
} from '@jsonforms/vue';
import ControlWrapper from './ControlWrapper.vue';
import { useVanillaControl } from '../../util';

const useRedisPartialPickerStates = (props: any) => {
  const input = useJsonFormsControl(props)
  const usePartial = ref(true)
  const partialValue = ref('partial-a')
  const redisPath = 'redis' // fixme: should read from options
  const partialPath = 'partial' // fixme: should read from options
  const handlePickerChange = (item: any) => {
    partialValue.value = item.value as string
    input.handleChange(partialPath, [partialValue.value])
    input.handleChange(redisPath, {})
  }

  watch(usePartial, (usePartialValue) => {
    if (usePartialValue) {
      input.handleChange(partialPath, [partialValue.value])
      input.handleChange(redisPath, {})
    } else {
      input.handleChange(partialPath, [])
      input.handleChange(redisPath, {})
    }
  })
  const childUiSchema = computed(() =>
    findUISchema(
      (input.control.value as any).uischemas,
      input.control.value.schema,
      input.control.value.uischema.scope,
      input.control.value.path,
      undefined,
      input.control.value.uischema,
      input.control.value.rootSchema
    )
  );
  return {
    usePartial,
    partialValue,
    childUiSchema,
    handlePickerChange,
  }
}
const controlRenderer = defineComponent({
  name: 'KRedisPartialControlRenderer',
  components: {
    ControlWrapper,
    DispatchRenderer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const res = useVanillaControl(
      useJsonFormsControl(props),
      (target) => target.checked
    );

    const rppStates = useRedisPartialPickerStates(props)
    return { ...res, ...rppStates }
  },
});

export default controlRenderer;

const isRedisPartialControl = uiTypeIs('KRedisPartialControl')

// export const entry: JsonFormsRendererRegistryEntry = {
//   renderer: controlRenderer,
//   tester: rankWith(1, isRedisPartialControl),
// };

export const tester = rankWith(1, isRedisPartialControl)
</script>

<style lang="scss" scoped>
.redis-config-card {
  margin-bottom: $kui-space-60;

  :deep(.form-group:last-child) {
    margin-bottom: 0;
  }
}

.dedicated-redis-config {
  margin-top: $kui-space-60;

  .dedicated-redis-config-title {
    font-size: $kui-font-size-40;
    font-weight: $kui-font-weight-bold;
    line-height: $kui-line-height-30;
    margin-bottom: $kui-space-60;
  }
}

.redis-config-radio-group {
  display: flex;
  gap: $kui-space-40;
  margin-bottom: 60px;
}
</style>
