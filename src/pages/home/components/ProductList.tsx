import { IProduct } from '@/api/dtos/productDTO';
import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';
import { PRODUCT_PAGE_SIZE } from '@/constants';
import { useModal } from '@/hooks/useModal';
import { CartItem } from '@/types/cartType';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { EmptyProduct } from './EmptyProduct';
import { ProductCard } from './ProductCard';
import { ProductRegistrationModal } from './ProductRegistrationModal';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/product';
import { useProductStore } from '@/store/product/useProductStore';
import { useCartStore } from '@/store/cart/useCartStore';
import { extractIndexLink, isFirebaseIndexError } from '@/helpers/error';
import { FirebaseIndexErrorModal } from '@/pages/error/components/FirebaseIndexErrorModal';

interface ProductListProps {
  pageSize?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  pageSize = PRODUCT_PAGE_SIZE,
}) => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] =
    useState<boolean>(false);
  const [indexLink, setIndexLink] = useState<string | null>(null);

  const { isLogin, user } = useAuthStore();
  const {
    items: products,
    hasNextPage,
    totalCount,
    filter,
  } = useProductStore();
  const { addCartItem } = useCartStore();

  const { data, isLoading, refetch } = useQuery<{
    products: IProduct[];
    hasNextPage: boolean;
    totalCount: number;
  }>({
    queryKey: ['products', currentPage, filter],
    queryFn: () => fetchProducts(filter, pageSize, currentPage),
    enabled: Boolean(
      filter.categoryId ||
        filter.title ||
        filter.minPrice !== undefined ||
        filter.maxPrice !== undefined
    ),
  });

  useEffect(() => {
    if (data) {
      useProductStore
        .getState()
        .loadProducts(
          data.products,
          data.hasNextPage,
          data.totalCount,
          currentPage === 1
        );
    }
  }, [data, currentPage]);

  const loadProductsData = async (isInitial = false): Promise<void> => {
    try {
      const page = isInitial ? 1 : currentPage + 1;
      const response = await fetchProducts(filter, pageSize, page);
      useProductStore.getState().loadProducts(
        response.products,
        response.hasNextPage,
        response.totalCount,
        isInitial
      );
      if (!isInitial) {
        setCurrentPage(page);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
  
      if (isFirebaseIndexError(errorMessage)) {
        const link = extractIndexLink(errorMessage);
        setIndexLink(link);
        setIsIndexErrorModalOpen(true);
      }
      throw error;
    }
  };
  

  useEffect(() => {
    if (filter) {
      console.log('필터 업데이트:', filter);
      setCurrentPage(1);
      refetch();
      loadProductsData(true);
    }
  }, [filter, refetch]);

  const handleCartAction = (product: IProduct): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handlePurchaseAction = (product: IProduct): void => {
    if (isLogin && user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem(cartItem, user.uid, 1);
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = (): void => {
    setCurrentPage(1);
    refetch();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          {isLogin && (
            <Button onClick={openModal}>
              <Plus className="mr-2 h-4 w-4" /> 상품 등록
            </Button>
          )}
        </div>

        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClickAddCartButton={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleCartAction(product);
                  }}
                  onClickPurchaseButton={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handlePurchaseAction(product);
                  }}
                />
              ))}
            </div>
            {hasNextPage && currentPage * pageSize < totalCount && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? '로딩 중...' : '더 보기'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
