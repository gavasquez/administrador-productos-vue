<template>
  <div class="flex justify-center p-10 bg-gray-10 space-x-3">
    <button
      :disabled="page === 1"
      @click="$router.push({ query: { page: page - 1 } })"
      class="flex items-center space-x-1.5 bg-blue-500 disabled:bg-gray-300 rounded-lg px-4 py-1.5 text-white hover:bg-blue-700 transition-all"
    >
      <ArrowLeftIcon />
      <span>Anterior</span>
    </button>
    <button
      :disabled="hasMoreDate"
      @click="$router.push({ query: { page: page + 1 } })"
      class="flex items-center space-x-1.5 bg-blue-500 disabled:bg-gray-300 rounded-lg px-4 py-1.5 text-white hover:bg-blue-700 transition-all"
    >
      <span>Siguiente</span>
      <ArrowRigthIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
import ArrowRigthIcon from '@/icons/ArrowRigthIcon.vue';

interface Props {
  page: number;
  hasMoreDate: boolean;
}

defineProps<Props>();
</script>
