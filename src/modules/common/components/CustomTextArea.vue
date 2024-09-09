<template>
  <div>
    <textarea
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="$emit('blur')"
      :class="['form-control', { 'border-red-500': error }]"
    ></textarea>
    <span class="text-red-400" v-if="error">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
export interface Props {
  modelValue?: string;
  error?: string;
  type?: 'text';
}

withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'blur']);
</script>
<style scoped>
.form-control {
  @apply shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
}
</style>
