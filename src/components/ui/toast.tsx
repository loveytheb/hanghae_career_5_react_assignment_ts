import { useToastStore } from '@/store/toast/useToastStore';

export const Toast = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-20 right-5 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-800 text-white p-3 rounded shadow-md"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
