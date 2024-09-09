<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">Productos</h1>
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">Imagen</th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">Titulo</th>
              <th class="w-28 py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="w-60 py-3 px-4 uppercase font-semibold text-sm">Tallas</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(product, index) in products"
              :key="product.id"
              :class="{
                'bg-gray-300': index % 2 === 0,
              }"
            >
              <td class="w-1/3 text-left py-3 px-4">
                <img :src="product.images[0]" :alt="product.title" class="w-10 h-10 object-cover" />
              </td>
              <td class="w-1/3 text-left py-3 px-4">
                <RouterLink
                  class="hover:text-blue-500 hover:underline"
                  :to="`/admin/products/${product.id}`"
                  >{{ product.title }}</RouterLink
                >
              </td>
              <td class="text-left py-3 px-4">
                <a class="hover:text-blue-500" href="tel:622322662"
                  ><span class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">{{
                    product.price
                  }}</span></a
                >
              </td>
              <td class="text-left py-3 px-4">
                <a class="hover:text-blue-500" href="mailto:jonsmith@mail.com">{{
                  product.sizes.join(',')
                }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ButtonPagination :has-more-date="!!products && products.length < 10" :page="page" />
    </div>
  </div>
</template>
<script setup lang="ts">
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue';
import { usePagination } from '@/modules/common/composable/usePagination';
import { getProductsActions } from '@/modules/products/actions';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { watchEffect } from 'vue';

const queryCliente = useQueryClient();

const { page } = usePagination();

const { data: products } = useQuery({
  queryKey: ['products', { page: page }],
  queryFn: () => getProductsActions(page.value),
  //staleTime: 1000 * 60,
});

watchEffect(() => {
  queryCliente.prefetchQuery({
    queryKey: ['products', { page: page.value + 1 }],
    queryFn: () => getProductsActions(page.value + 1),
  });
});
</script>
