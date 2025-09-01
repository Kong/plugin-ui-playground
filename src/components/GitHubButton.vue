<template>
  <KTooltip
    text="View source on GitHub"
  >
    <KButton
      icon
      appearance="tertiary"
      @click="openGitHub"
    >
      <GithubIcon />
    </KButton>
  </KTooltip>
</template>

<script setup lang="ts">
import { GithubIcon } from '@kong/icons'

/**
 * Handle GitHub button click
 */
function openGitHub() {
  window.open('https://github.com/Kong/plugin-ui-playground', '_blank', 'noopener,noreferrer')
}
</script>
