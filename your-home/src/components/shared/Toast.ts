import { toast } from 'sonner';

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#1a1a1a',
      border: '1px solid #333',
      color: '#e0e0e0',
    },
    position: 'top-right',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#1a1a1a',
      border: '1px solid #333',
      color: '#e0e0e0',
    },
    position: 'top-right',
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#1a1a1a',
      border: '1px solid #333',
      color: '#e0e0e0',
    },
    position: 'top-right',
  });
};

export const showInfo = (message: string) => {
  toast(message, {
    style: {
      background: '#1a1a1a',
      border: '1px solid #333',
      color: '#e0e0e0',
    },
    position: 'top-right',
  });
};
