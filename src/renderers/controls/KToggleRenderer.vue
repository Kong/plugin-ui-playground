<template>
  <KInputSwitch
    v-model="control.data"
    :disabled="!control.enabled"
    :label="control.label"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { KInputSwitch } from '@kong/kongponents'

import { useControl } from '../compositions/useControl'

import type { ControlElement } from '@jsonforms/core'
import type { RendererProps } from '@jsonforms/vue'

const props = defineProps<RendererProps<ControlElement>>()

const {
  control,
  onChange,
} = useControl(props)
</script>

<script lang="ts">
import type { RankedTester } from '@jsonforms/core'
import {
  rankWith,
  isBooleanControl,
  and,
  optionIs,
} from '@jsonforms/core'

export const tester: RankedTester = rankWith(
  3,
  and(isBooleanControl, optionIs('toggle', true)),
)
</script>
