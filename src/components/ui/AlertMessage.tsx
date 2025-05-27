import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface AlertMessageProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

export const AlertMessage: React.FC<AlertMessageProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const Icon = iconMap[variant];
  
  return (
    <div
      className={clsx(
        'rounded-md border p-4',
        {
          'border-green-200 bg-green-50': variant === 'success',
          'border-yellow-200 bg-yellow-50': variant === 'warning',
          'border-red-200 bg-red-50': variant === 'error',
          'border-blue-200 bg-blue-50': variant === 'info',
        },
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon
            className={clsx('h-5 w-5', {
              'text-green-400': variant === 'success',
              'text-yellow-400': variant === 'warning',
              'text-red-400': variant === 'error',
              'text-blue-400': variant === 'info',
            })}
          />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3
              className={clsx('text-sm font-medium', {
                'text-green-800': variant === 'success',
                'text-yellow-800': variant === 'warning',
                'text-red-800': variant === 'error',
                'text-blue-800': variant === 'info',
              })}
            >
              {title}
            </h3>
          )}
          
          <div
            className={clsx('text-sm', {
              'text-green-700': variant === 'success',
              'text-yellow-700': variant === 'warning',
              'text-red-700': variant === 'error',
              'text-blue-700': variant === 'info',
              'mt-2': title,
            })}
          >
            {children}
          </div>
        </div>
        
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={clsx(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  {
                    'text-green-500 hover:bg-green-100 focus:ring-green-600': variant === 'success',
                    'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600': variant === 'warning',
                    'text-red-500 hover:bg-red-100 focus:ring-red-600': variant === 'error',
                    'text-blue-500 hover:bg-blue-100 focus:ring-blue-600': variant === 'info',
                  }
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};