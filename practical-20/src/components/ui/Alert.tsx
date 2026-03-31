import React from 'react';
import successIcon from '../../assets/success.svg';
import errorIcon from '../../assets/error.svg';
import warningIcon from '../../assets/warning.svg';
import infoIcon from '../../assets/info.svg';
import closeIcon from '../../assets/cross.svg';

export enum AlertType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export type  AlertVariant = `${AlertType}`;

interface AlertProps {
  type:  AlertVariant;
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const getStyles = () => {
    switch (type) {
      case AlertType.SUCCESS:
        return 'bg-neutral-900/90 border-teal-400/25 text-white';
      case AlertType.ERROR:
        return 'bg-neutral-900/90 border-rose-400/25 text-white';
      case AlertType.WARNING:
        return 'bg-neutral-900/90 border-amber-400/25 text-white';
      case AlertType.INFO:
        return 'bg-neutral-900/90 border-sky-400/25 text-white';
      default:
        return 'bg-neutral-900/90 border-white/15 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case AlertType.SUCCESS:
        return (
         <img src={successIcon} className="h-5 w-5" alt="close" />
        );
      case AlertType.ERROR:
        return (
          <img src={errorIcon} className="h-5 w-5" alt="close" />
        );
      case AlertType.WARNING:
        return (
         <img src={warningIcon} className="h-5 w-5" alt="close" />
        );
      case AlertType.INFO:
        return (
          <img src={infoIcon} className="h-5 w-5" alt="close" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-lg backdrop-blur ${getStyles()}`}>
      <div className="flex items-start">
        <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-lg p-1.5 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              <span className="sr-only">Dismiss</span>
              <img src={closeIcon} className="h-5 w-5" alt="close" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface AlertToastProps {
  alerts: Array<{ id: string; type:  AlertVariant; message: string }>;
  onDismiss: (id: string) => void;
}

export const AlertToast: React.FC<AlertToastProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <div key={alert.id} className="animate-toastIn">
          <Alert type={alert.type} message={alert.message} onClose={() => onDismiss(alert.id)} />
        </div>
      ))}
    </div>
  );
};

