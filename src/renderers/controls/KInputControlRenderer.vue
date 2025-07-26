<template>
  <KInput
    v-model="control.data"
    :disabled="!control.enabled"
    :error="!!control.errors"
    :error-message="control.errors"
    :label="control.label"
    :label-attributes="labelAttributes"
    :placeholder="appliedOptions.placeholder"
    :required="control.required"
    :show-password-mask-toggle="isPassword"
    :type="inputType"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KInput } from '@kong/kongponents'

import { useControl } from '../compositions/useControl'

import type { ControlElement } from '@jsonforms/core'
import type { RendererProps } from '@jsonforms/vue'

const props = defineProps<RendererProps<ControlElement>>()

const {
  control,
  appliedOptions,
  onChange,
} = useControl(props)

const isNumber = computed(() => control.value.schema.type === 'integer' || control.value.schema.type === 'number')
const isPassword = computed(() => control.value.schema.format === 'password')

const inputType = computed(() => {
  if (isPassword.value) {
    return 'password'
  }
  return isNumber.value ? 'number' : 'text'
})

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  let value: string | number = target.value
  if (isNumber.value) {
    value = Number(value)
  }
  onChange(null)
}

const labelAttributes = computed(() => control.value.schema.description ? {
  info: control.value.schema.description,
  tooltipAttributes: { maxWidth: '400' },
} : undefined)
</script>

<script lang="ts">
import type { RankedTester } from '@jsonforms/core'
import {
  rankWith,
  isStringControl,
} from '@jsonforms/core'

export const tester: RankedTester = rankWith(1, isStringControl)
</script>
