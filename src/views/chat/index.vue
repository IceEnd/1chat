<template>
  <div class="d-flex w-full h-full">
    <session-list />
    <chat />
  </div>
</template>

<script setup lang="ts">
import SessionList from './session-list.vue';
import Chat from './chat.vue';
</script>
