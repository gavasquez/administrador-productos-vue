import { createUpdateProductAction, getProductById } from '@/modules/products/actions';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Este campo es super importante')
    .min(3, 'Mínimo de 3 caracteres!!!'),

  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: { CustomInput, CustomTextArea },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductById(props.productId),
      retry: false, // <--- disable retry
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: validationSchema,
      //initialValues: product.value,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');
    const imageFiles = ref<File[]>([]);

    const { fields: images } = useFieldArray<string>('images');
    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction, // <--- mutation function
    });

    const onSubmit = handleSubmit((values) => {
      const formValues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };
      mutate(formValues!);
    });

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);
      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const onFilesChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const filesList = fileInput.files;
      if (!filesList) return;
      if (filesList.length === 0) return;
      for (const imageFile of filesList) {
        imageFiles.value.push(imageFile);
      }
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return;
      }
    });

    watch(
      product,
      () => {
        if (!product) return;
        resetForm({
          values: product.value,
        });
        imageFiles.value = []; // reset image files
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(isUpdateSuccess, (value) => {
      if (!value) return;
      toast.success('Product updated successfully');
      // TODO: redireccion cuando se crea
      router.replace(`/admin/products/${updatedProduct.value!.id}`);
      // Restablecer los valores del formulario
      resetForm({
        values: updatedProduct.value,
      });
    });

    watch(
      () => props.productId,
      () => {
        refetch();
      },
    );

    return {
      // Propiedades
      values,
      errors,
      meta,
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      images,
      sizes,
      isPending,
      imageFiles,
      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Accion
      onSubmit,
      toggleSize,
      hasSize: (size: string) => {
        const currentSizes = sizes.value.map((s) => s.value);
        return currentSizes.includes(size);
      },
      onFilesChanged,
      temporalImageUrl: (imageFile: File) => {
        return URL.createObjectURL(imageFile);
      },
    };
  },
});
