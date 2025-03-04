<template>
  <div
    v-if="layout.visible"
    class="kong-ui-entity-form-section"
  >
    <div class="form-section-wrapper">
      <div class="form-section-info">
        <div
          v-if="layout.label"
          class="form-section-title"
        >
          {{ layout.label }}
        </div>
        <div
          class="form-section-description"
          v-if="(layout.uischema as any).description"
        >
          {{ (layout.uischema as any).description }}
        </div>
      </div>
      <div class="form-section-content">
        <div
          v-for="(element, index) in layout.uischema.elements"
          :key="`${layout.path}-${index}`"
        >
          <dispatch-renderer
            :schema="layout.schema"
            :uischema="element"
            :path="layout.path"
            :enabled="layout.enabled"
            :renderers="layout.renderers"
            :cells="layout.cells"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- <fieldset v-if="layout.visible" >
    <legend v-if="layout.label" >
      KKKK {{ layout.label }}
    </legend>
    <div
      v-for="(element, index) in layout.uischema.elements"
      :key="`${layout.path}-${index}`"
    >
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>
  </fieldset> -->
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  and,
  isLayout,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from 'vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue';
// import { useVanillaLayout } from '../util';

const layoutRenderer = defineComponent({
  name: 'GroupRenderer',
  components: {
    DispatchRenderer,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    console.log(props)
    return useJsonFormsLayout(props);
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('KEntitySection'))),
};
</script>

<style lang="scss" scoped>
fieldset {
  margin: 0;
  min-width: 0;
  padding: 0;
}

.kong-ui-entity-form-section {
  text-align: left;
  border: 0;

  .form-section-wrapper {
    column-gap: $kui-space-60;
    display: flex;
    flex-direction: column;
    padding-bottom: $kui-space-130;
    row-gap: $kui-space-50;
    width: 100%;

    @media (min-width: $kui-breakpoint-tablet) {
      flex-direction: row;
    }

    .form-section-info {
      flex: 1;

      @media (min-width: $kui-breakpoint-tablet) {
        max-width: 350px;

        &.sticky {
          height: fit-content;
          margin-bottom: $kui-space-60;
          position: sticky;
          top: 16px;
        }
      }

      .form-section-title {
        color: $kui-color-text;
        font-size: $kui-font-size-40;
        font-weight: $kui-font-weight-bold;
        line-height: $kui-line-height-30;
        margin-bottom: $kui-space-40;
        margin-top: $kui-space-0;
      }

      .form-section-description,
      .form-section-description p,
      .form-section-description :deep(p) {
        color: $kui-color-text;
        font-size: $kui-font-size-30;
        font-weight: 400;
        line-height: 20px;
        margin: 0;
      }

      .form-section-footer {
        margin-top: $kui-space-90;
      }
    }

    .form-section-content {
      flex: 1;

      &:deep(> *) {
        &:not(:first-child) {
          margin-top: $kui-space-80;
        }
      }
    }
  }

  &.has-divider {
    .form-section-wrapper {
      border-bottom: $kui-border-width-10 solid $kui-color-border;
    }
  }
}
</style>
