import { IProduct, NewProductDTO } from '@/api/dtos/productDTO';
import { addProductAPI } from '@/api/product';
import { useMutation } from '@tanstack/react-query';

export const useAddProduct = () => {
  return useMutation<IProduct, Error, NewProductDTO>({
    mutationFn: (productData: NewProductDTO) => addProductAPI(productData),
    onSuccess: (newProduct) => {
      console.log('Product added successfully', newProduct);
    },
    onError: (error) => {
      console.error('Error adding product', error);
    },
  });
};
