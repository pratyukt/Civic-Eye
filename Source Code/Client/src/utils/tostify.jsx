import { toast } from 'react-toastify';

export const notifyError = (err) => toast.error(err);
export const notifySuccess = (suc) => toast.success(suc);