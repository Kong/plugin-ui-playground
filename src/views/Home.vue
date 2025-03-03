<template>
  <div class="home-container">
    <aside class="sidebar">
      <h2>Case List</h2>
      <ul class="case-list">
        <li v-for="(caseItem, index) in cases" :key="index">
          <a href="#" @click.prevent="scrollToCase(caseItem.name)">
            {{ caseItem.name }}
          </a>
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <h1>Kong JSONForm Demos</h1>
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
import { ref, reactive } from 'vue'
// import { casesData } from '../data/cases'
import CaseItem from '../components/CaseItem.vue'
import { getCases } from '../helpers/case-register.ts'
import '../cases'

const cases = ref(getCases())
const activeTabs = reactive<Record<string, string>>({})

// Initialize default active tab for each case
cases.value.forEach(caseItem => {
  activeTabs[caseItem.name] = 'Demo'
})

const scrollToCase = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
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
</style>
