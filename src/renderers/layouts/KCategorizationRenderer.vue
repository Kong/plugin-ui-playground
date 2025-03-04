<template>
  <KTabs :tabs="categories.map(c => ({ title: c.value.label, hash: c.value.label }))">
    <template
      v-for="(category) in categories"
      :key="`category-${index}`"
      #[category.value.label]
    >
      <DispatchRenderer
        v-if="category"
        :schema="layout.schema"
        :uischema="category.value.uischema"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </template>
  </KTabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { JsonFormsRendererRegistryEntry, Layout } from '@jsonforms/core';
import {
  and,
  categorizationHasCategory,
  isCategorization,
  rankWith,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsCategorization,
  type RendererProps,
} from '@jsonforms/vue';
import { useVanillaLayout } from '../../util';

const layoutRenderer = defineComponent({
  name: 'CategorizationRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVanillaLayout(useJsonFormsCategorization(props));
  },
  data() {
    return {
      selected: 0,
    };
  },
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isCategorization, categorizationHasCategory)),
};
</script>
