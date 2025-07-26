<template>
  <div class="playground-container">
    <Form :schema="schema" />
  </div>
</template>

<script setup lang="ts">
import { FreeForm } from '@kong-ui-public/entities-plugins'
import type { FormSchema } from '@kong-ui-public/entities-plugins/dist/types/types/plugins/form-schema.js';
const {
  Form
} = FreeForm

const schema: FormSchema = {
  fields: [
    {
      name: {
        type: 'string',
      }
    }
  ],
  type: 'record'
}
</script>

<style scoped lang="scss">
.playground-container {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 0 auto;
  width: 600px;
  max-width: 100%;
}
</style>
