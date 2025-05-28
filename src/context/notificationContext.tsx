import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationVariant = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  variant: NotificationVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove after duration
      const duration = notification.duration || 5000;
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string) => {
      addNotification({ variant: "success", message, title });
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      addNotification({ variant: "error", message, title });
    },
    [addNotification]
  );

  const warning = useCallback(
    (message: string, title?: string) => {
      addNotification({ variant: "warning", message, title });
    },
    [addNotification]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      addNotification({ variant: "info", message, title });
    },
    [addNotification]
  );

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
