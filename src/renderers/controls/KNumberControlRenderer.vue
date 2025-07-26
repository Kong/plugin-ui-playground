<template>
  <KInputControlRenderer v-bind="props" />
</template>

<script setup lang="ts">
import KInputControlRenderer from './KInputControlRenderer.vue'

import type { ControlElement } from '@jsonforms/core'
import type { RendererProps } from '@jsonforms/vue'

const props = defineProps<RendererProps<ControlElement>>()
</script>

<script lang="ts">
import type { RankedTester } from '@jsonforms/core'
import {
  rankWith,
  isIntegerControl,
  isNumberControl,
  or,
} from '@jsonforms/core'

export const tester: RankedTester = rankWith(1, or(isIntegerControl, isNumberControl))
</script>
