<template>
  <div class="home-container">
    <aside class="sidebar">
      <h2>Case List</h2>
      <ul class="case-list">
        <li v-for="(caseItem, index) in cases" :key="index">
          <a
            href="#"
            @click.prevent="handleSelected(caseItem)"
            :class="{ active: selectedCase === caseItem.name }"
          >
            {{ caseItem.name }}
          </a>
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <section class="intro">
        <h1>JSON Forms + Kongponents</h1>
        <p>
          This is a PoC on how to fully control a form using <a target="_blank" href="https://jsonforms.io/">JSON Forms</a> with a custom layout. <br />
          Github: <a target="_blank" href="https://github.com/2eha0/learn-jsonforms">https://github.com/2eha0/learn-jsonforms</a> <br />
          Live Demo: <a target="_blank" href="https://learn-json-form.vercel.app/">https://learn-json-form.vercel.app/</a>
        </p>
        <ul class="features">
          <li>
            <i>📝</i>
            <span>A <b>form generator</b> based on JSON Schema</span>
          </li>
          <li>
            <i>🎨</i>
            <span><b>Full control</b> over form layout using UI Schema</span>
          </li>
          <li>
            <i>🔧</i>
            <span><b>Custom UI</b> rendering by extending UI Schema</span>
          </li>
        </ul>
      </section>
      <div class="cases-container">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import CaseItem from '../components/CaseItem.vue'
import { getCases } from '../helpers/case-register.ts'
import type { Case } from '../types/case.ts'
import '../cases'

const cases = ref(getCases())
const selectedCase = ref(cases.value[0].name)

const scrollToCase = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleSelected = (caseItem: Case) => {
  scrollToCase(caseItem.name)
  selectedCase.value = caseItem.name
}
</script>

<style scoped>
.intro {
  margin-bottom: 80px;
  text-align: center;
}

.intro p {
  margin-bottom: 20px;
}

.intro h2 {
  margin-top: 40px;
}

.features {
  list-style: none;
  padding: 0 40px;
  display: flex;
  gap: 80px;
}

.features i {
  font-size: 40px;
  display: block;
}

.home-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.case-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-list li {
  margin-bottom: 10px;
}

.case-list a {
  display: block;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.case-list a:hover {
  background-color: #e0e0e0;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.cases-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}


h1 {
  margin-bottom: 20px;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.active {
  background-color: #fff;
  font-weight: bold;
}
</style>
