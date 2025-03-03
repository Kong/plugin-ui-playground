<template>
  <div class="app-container">
    <KNavbar>
      <template #logo>
        <div class="app-logo">Kong JSONForm Demo</div>
      </template>
    </KNavbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
// No additional setup needed
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

/* Import JSONForms styles */
@import '@jsonforms/vue-vanilla/vanilla.css';
</style>
