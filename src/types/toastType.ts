export interface Toast {
  id: string;
  message: string;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (message: string) => void;
  removeToast: (id: string) => void;
}
