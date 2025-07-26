import { useJsonFormsControl } from '@jsonforms/vue'
import { computed } from 'vue'

import type { ControlElement } from '@jsonforms/core'
import type { RendererProps } from '@jsonforms/vue'

export const useControl = (props: RendererProps<ControlElement>) => {
  const input = useJsonFormsControl(props)
  const appliedOptions = computed(() =>
    Object.assign(
      {},
      input.control.value.config,
      input.control.value.uischema.options,
    ),
  )

  const onChange = (value: any) => {
    input.handleChange(input.control.value.path, value)
  }

  return {
    ...input,
    appliedOptions,
    onChange,
  }
}
