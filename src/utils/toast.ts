import { toast } from 'react-toastify';

const options = {
  autoClose: 6000,
  pauseOnHover: true,
} as const;

export const notify = {
  success: (message: string) => toast.success(message, options),
  error: (message: string) => toast.error(message, options),
  warning: (message: string) => toast.warning(message, options),
};
