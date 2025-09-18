import React, { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const typeStyles = {
    info: {
      headerBg: 'bg-blue-50',
      headerText: 'text-blue-900',
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
    },
    success: {
      headerBg: 'bg-green-50',
      headerText: 'text-green-900',
      confirmButton: 'bg-green-600 hover:bg-green-700',
    },
    warning: {
      headerBg: 'bg-yellow-50',
      headerText: 'text-yellow-900',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
    },
    danger: {
      headerBg: 'bg-red-50',
      headerText: 'text-red-900',
      confirmButton: 'bg-red-600 hover:bg-red-700',
    },
  };

  const currentTypeStyle = typeStyles[type];

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleBackdropClick}
        />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`
            inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all 
            sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} ${className}
          `}
        >
          {/* Header */}
          <div className={`px-4 py-3 ${currentTypeStyle.headerBg} sm:px-6`}>
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg leading-6 font-medium ${currentTypeStyle.headerText}`}
                id="modal-title"
              >
                {title}
              </h3>
              {showCloseButton && (
                <button
                  type="button"
                  className={`rounded-md ${currentTypeStyle.headerText} hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {onConfirm ? (
              <>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${currentTypeStyle.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={onConfirm}
                >
                  {confirmText}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${currentTypeStyle.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm`}
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;