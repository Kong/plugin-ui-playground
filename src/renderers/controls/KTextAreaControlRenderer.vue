<template>
  <KTextArea
    v-model="control.data"
    :disabled="!control.enabled"
    :error="!!control.errors"
    :help="control.errors"
    :label="control.label"
    :label-attributes="labelAttributes"
    :placeholder="appliedOptions.placeholder"
    :required="control.required"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KTextArea } from '@kong/kongponents'

import { useControl } from '../compositions/useControl'

import type { ControlElement } from '@jsonforms/core'
import type { RendererProps } from '@jsonforms/vue'

const props = defineProps<RendererProps<ControlElement>>()

const {
  control,
  appliedOptions,
  onChange,
} = useControl(props)

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  onChange(target.value)
}

const labelAttributes = computed(() => {
  const ret = control.value.schema.description ? {
    info: control.value.schema.description,
    tooltipAttributes: { maxWidth: '400' },
  } : undefined
  return ret
})
</script>

<script lang="ts">
import type { RankedTester } from '@jsonforms/core'
import {
  rankWith,
  isStringControl,
  and,
  optionIs,
} from '@jsonforms/core'

export const tester: RankedTester = rankWith(
  2,
  and(isStringControl, optionIs('multi', true)),
)
</script>
