<template>
  <div class="array-item-wrapper">
    <div class="array-item">
      <slot></slot>

      <KButton
        :disabled="!deleteEnabled"
        type="button"
        @click="deleteClicked"
        appearance="tertiary"
        icon
      >
        <TrashIcon />
      </KButton>
    </div>
  </div>
</template>

<script lang="ts">
import { TrashIcon } from '@kong/icons'
import { defineComponent, PropType } from 'vue';
import { classes, Styles } from '../../styles';

const listItem = defineComponent({
  name: 'ArrayListElement',
  components: {
    TrashIcon,
  },
  props: {
    initiallyExpanded: {
      required: false,
      type: Boolean,
      default: false,
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    moveUpEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveDownEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    moveUp: {
      required: false,
      type: Function,
      default: undefined,
    },
    moveDown: {
      required: false,
      type: Function,
      default: undefined,
    },
    deleteEnabled: {
      required: false,
      type: Boolean,
      default: true,
    },
    delete: {
      required: false,
      type: Function,
      default: undefined,
    },
    styles: {
      required: true,
      type: Object as PropType<Styles>,
    },
  },
  data() {
    return {
      expanded: this.initiallyExpanded,
    };
  },
  computed: {
    contentClasses(): string {
      return classes`${this.styles.arrayList.itemContent} ${
        this.expanded && this.styles.arrayList.itemExpanded
      }`;
    },
    toolbarClasses(): string {
      return classes`${this.styles.arrayList.itemToolbar} ${
        this.expanded && this.styles.arrayList.itemExpanded
      }`;
    },
  },
  methods: {
    expandClicked(): void {
      this.expanded = !this.expanded;
    },
    moveUpClicked(event: Event): void {
      event.stopPropagation();
      this.moveUp?.();
    },
    moveDownClicked(event: Event): void {
      event.stopPropagation();
      this.moveDown?.();
    },
    deleteClicked(event: Event): void {
      event.stopPropagation();
      this.delete?.();
    },
  },
});

export default listItem;
</script>

<style lang="scss" scoped>
.array-item-wrapper {
  width: 100%;
}

.array-item {
  display: flex;
  width: 100%;

  :deep(.k-button) {
    margin-top: -24px;
    &.delete {
      align-self: center;
      height: 100%;
      margin-left: $kui-space-70;
    }
  }

  :deep(.vertical-layout) {
    width: 100%;
  }
}
</style>
