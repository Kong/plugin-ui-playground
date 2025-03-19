<template>
  <div class="app-container">
    <aside class="sidebar">
      <h2>Navigation</h2>
      <ul class="nav-list">
        <li v-for="item in routes" :key="item.path">
          <router-link
            :to="item.path"
            :class="{ active: isActive(item.path) }"
          >
            {{ item.name }}
          </router-link>
          <ul v-if="isActive(item.path) && item.name === 'Cases'" class="sub-nav-list">
            <li v-for="child in getCases()" :key="child.name">
              <a
                :href="`${item.path}#${child.name}`"
                @click.prevent="scrollToSection(child.name)"
                :class="{ active: activeHash === child.name }"
              >
                {{ child.name }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
    <div class="main-layout">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { routes } from './router'
import '@jsonforms/vue-vanilla/vanilla.css'
import { getCases } from './helpers/case-register'
import './cases'

const route = useRoute()
const activeHash = ref<string>()

watch(
  () => route.path,
  () => {
    activeHash.value = undefined
  }
)

const isActive = (path: string) => {
  return route.path === path
}

const scrollToSection = (id: string) => {
  activeHash.value = id
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
  height: 100vh;
  overflow-y: auto;
}

.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 20px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 10px;
}

.nav-list a {
  display: block;
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.nav-list a:hover {
  background-color: #e0e0e0;
}

.sub-nav-list {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}

.sub-nav-list li {
  margin-bottom: 5px;
}

.sub-nav-list a {
  padding: 6px 10px;
  font-size: 0.9em;
}

.active {
  background-color: #fff;
  font-weight: bold;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
}
</style>
