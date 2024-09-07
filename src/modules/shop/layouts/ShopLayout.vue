<template>
  <!-- TopMenu -->
  <TopMenu />
  <!-- End TopMenu -->

  <!-- RouterView -->
  <RouterView />

  <!-- Footer -->
  <CustomFooter />
  <!-- End Footer -->
</template>
<script setup lang="ts">
import TopMenu from '../components/TopMenu.vue';
import CustomFooter from '../components/CustomFooter.vue';
import { RouterView } from 'vue-router';
</script>
