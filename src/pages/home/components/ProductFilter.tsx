import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { ApiErrorBoundary } from '@/pages/common/components/ApiErrorBoundary';
import { debounce } from '@/utils/common';
import { CategoryRadioGroup } from './CategoryRadioGroup';
import { PriceRange } from './PriceRange';
import { SearchBar } from './SearchBar';
import { useFilterStore } from '@/store/filter/useFilterStore';
import { useProductStore } from '@/store/product/useProductStore';

interface ProductFilterBoxProps {
  children: React.ReactNode;
}

const ProductFilterBox: React.FC<ProductFilterBoxProps> = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  const {
    setTitle,
    setMinPrice,
    setMaxPrice,
    setCategoryId,
    categoryId,
    title,
    minPrice,
    maxPrice,
  } = useFilterStore();
  const { updateFilter } = useProductStore();

  useEffect(() => {
    updateFilter({
      title,
      minPrice: minPrice === -1 ? undefined : minPrice,
      maxPrice: maxPrice === -1 ? undefined : maxPrice,
      categoryId,
    });
  }, [title, minPrice, maxPrice, categoryId, updateFilter]);

  const handleChangeInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    300
  );

  const handlePriceChange = (action: (value: number) => void) =>
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value === '' ? -1 : Math.max(0, parseInt(value, 10));
      if (!isNaN(numericValue)) {
        action(numericValue);
      }
    }, 300);

  const handleMinPrice = handlePriceChange(setMinPrice);
  const handleMaxPrice = handlePriceChange(setMaxPrice);

  const handleChangeCategory = (value: string) => {
    if (value) {
      setCategoryId(value);
    } else {
      console.error('카테고리가 설정되지 않았습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="h-24 w-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={categoryId}
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange
          onChangeMinPrice={handleMinPrice}
          onChangeMaxPrice={handleMaxPrice}
        />
      </ProductFilterBox>
    </div>
  );
};
