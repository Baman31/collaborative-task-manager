import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, Toast as ToastType } from '../../hooks/useToast';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ToastItem = ({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) => {
  const Icon = icons[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[toast.type]} animate-slide-in`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-white/50 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
