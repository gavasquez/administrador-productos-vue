import { tesloApi } from '@/api/tesloApi';
import { type Product } from '../interfaces/product.interface';
import { getProductImageAction } from './getProductImage.actions';

export const getProductsActions = async (page = 1, limit = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${page * limit}`,
    );

    return data.map((product) => {
      return {
        ...product,
        images: product.images.map((image) => getProductImageAction(image)),
      };
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
