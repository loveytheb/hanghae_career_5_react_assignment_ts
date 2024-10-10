import { NewProductDTO } from '@/api/dtos/productDTO';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_CATEGORY_ID, categories } from '@/constants';
import { createNewProduct, initialProductState } from '@/helpers/product';
import { useAddProduct } from '@/hooks/useAddProduct';
import { useToastStore } from '@/store/toast/useToastStore';
import { uploadImage } from '@/utils/imageUpload';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const ProductRegistrationModal: React.FC<
  ProductRegistrationModalProps
> = ({ isOpen, onClose, onProductAdded }) => {
  const productMutation = useAddProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewProductDTO>({
    defaultValues: initialProductState,
  });

  const watchCategory = watch('category.id');
  const watchImage = watch('image') as FileList | null;

  const onSubmit: SubmitHandler<NewProductDTO> = async (
    data
  ): Promise<void> => {
    try {
      const imageFiles = watchImage;
      if (!imageFiles || imageFiles.length === 0) {
        throw new Error('이미지를 선택해야 합니다.');
      }

      const imageUrl = await uploadImage(imageFiles[0]);
      if (!imageUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const newProduct = createNewProduct(data, imageUrl);
      productMutation.mutate(newProduct);
      useToastStore.getState().addToast('상품 등록에 성공했습니다.');
      onClose();
      onProductAdded();
    } catch (error) {
      console.error('물품 등록에 실패했습니다.', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('title', {
              required: '상품명은 필수입니다.',
            })}
            type="text"
            placeholder="상품명"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Input
            {...register('price', {
              required: '가격은 필수입니다.',
              valueAsNumber: true,
            })}
            type="number"
            placeholder="가격"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}

          <Textarea
            {...register('description', {
              required: '상품 설명은 필수입니다.',
            })}
            className="resize-none"
            placeholder="상품 설명"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <Select
            {...register('category.id', {
              required: '카테고리 선택은 필수입니다.',
            })}
            onValueChange={(value) => setValue('category.id', value)}
            value={watchCategory || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((category) => category.id !== ALL_CATEGORY_ID)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.category?.id && (
            <p className="text-red-500">{errors.category.id.message}</p>
          )}

          <Input
            {...register('image', {
              required: '이미지는 필수입니다.',
            })}
            className="cursor-pointer"
            type="file"
            accept="image/*"
          />
          {watchImage && watchImage.length > 0 && (
            <p className="text-gray-500">선택된 파일: {watchImage[0].name}</p>
          )}
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
