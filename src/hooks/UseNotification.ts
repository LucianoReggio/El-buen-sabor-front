import { useCallback } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export function useNotifications() {
  const show = useCallback(
    (
      type: NotificationType,
      message: string,
      options?: NotificationOptions
    ) => {
      // Aquí integrarías con tu librería favorita (react-hot-toast, react-toastify, etc.)
      console.log(`[${type.toUpperCase()}]`, message, options);

      // Ejemplo con react-hot-toast (comentado)
      // if (type === 'success') toast.success(message);
      // if (type === 'error') toast.error(message);
      // if (type === 'warning') toast(message, { icon: '⚠️' });
      // if (type === 'info') toast(message, { icon: 'ℹ️' });
    },
    []
  );

  return {
    success: (message: string, options?: NotificationOptions) =>
      show("success", message, options),
    error: (message: string, options?: NotificationOptions) =>
      show("error", message, options),
    warning: (message: string, options?: NotificationOptions) =>
      show("warning", message, options),
    info: (message: string, options?: NotificationOptions) =>
      show("info", message, options),
  };
}
