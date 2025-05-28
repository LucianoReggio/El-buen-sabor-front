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
      // Implementación simple con console.log por ahora
      // En producción integrarías con react-hot-toast, react-toastify, etc.
      const timestamp = new Date().toLocaleTimeString();
      const prefix = `[${timestamp}] [${type.toUpperCase()}]`;

      console.log(`${prefix} ${message}`, options);

      // Si quieres usar browser notifications nativas:
      // if (Notification.permission === 'granted') {
      //   new Notification(options?.title || 'Notificación', {
      //     body: message,
      //     icon: '/favicon.ico'
      //   });
      // }

      // Ejemplo de integración con react-hot-toast (comentado):
      // import toast from 'react-hot-toast';
      // switch (type) {
      //   case 'success':
      //     toast.success(message, { duration: options?.duration });
      //     break;
      //   case 'error':
      //     toast.error(message, { duration: options?.duration });
      //     break;
      //   case 'warning':
      //     toast(message, { icon: '⚠️', duration: options?.duration });
      //     break;
      //   case 'info':
      //     toast(message, { icon: 'ℹ️', duration: options?.duration });
      //     break;
      // }
    },
    []
  );

  return {
    // Métodos principales
    success: (message: string, options?: NotificationOptions) =>
      show("success", message, options),
    error: (message: string, options?: NotificationOptions) =>
      show("error", message, options),
    warning: (message: string, options?: NotificationOptions) =>
      show("warning", message, options),
    info: (message: string, options?: NotificationOptions) =>
      show("info", message, options),

    // Método genérico
    show,
  };
}
