<template>
  <div class="d-flex w-full h-full">
    <session-list />
    <chat />
  </div>
</template>

<script setup lang="ts">
import SessionList from './list/index.vue';
import Chat from './chat/index.vue';
</script>
