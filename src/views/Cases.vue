<template>
  <main class="main-content">
    <div class="cases-list">
      <div
        v-for="(caseItem, index) in cases"
        :key="index"
        :id="caseItem.name"
        class="case-item"
      >
        <CaseItem :caseItem="caseItem"/>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import CaseItem from '../components/CaseItem.vue'
import { getCases } from '../helpers/case-register.ts'
import '../cases'

const cases = getCases()
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.cases-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
