import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '../utils/logger';

export interface ModalConfig {
  id: string;
  title: string;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  children?: React.ReactNode;
}

export const useModal = () => {
  const [modals, setModals] = useState<ModalConfig[]>([]);
  const modalCountRef = useRef(0);

  const generateModalId = useCallback(() => {
    modalCountRef.current += 1;
    return `modal-${Date.now()}-${modalCountRef.current}`;
  }, []);

  const openModal = useCallback((config: Omit<ModalConfig, 'id' | 'isOpen'>) => {
    const id = generateModalId();
    const modalConfig: ModalConfig = {
      ...config,
      id,
      isOpen: true,
    };

    setModals(prev => [...prev, modalConfig]);
    logger.debug('Modal opened:', id);
    return id;
  }, [generateModalId]);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
    logger.debug('Modal closed:', id);
  }, []);

  const closeAllModals = useCallback(() => {
    const count = modals.length;
    setModals([]);
    logger.debug('All modals closed:', count);
  }, [modals.length]);

  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev => prev.map(modal => 
      modal.id === id ? { ...modal, ...updates } : modal
    ));
    logger.debug('Modal updated:', id);
  }, []);

  // Convenience methods for common modal types
  const showConfirmDialog = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      type?: 'warning' | 'danger';
    }
  ) => {
    return openModal({
      title,
      children: <div className="text-gray-700">{message}</div>,
      onConfirm,
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
      type: options?.type || 'warning',
    });
  }, [openModal]);

  const showAlert = useCallback((
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'danger' = 'info'
  ) => {
    return openModal({
      title,
      children: <div className="text-gray-700">{message}</div>,
      confirmText: 'OK',
      type,
    });
  }, [openModal]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modals.length > 0) {
        const lastModal = modals[modals.length - 1];
        closeModal(lastModal.id);
      }
    };

    if (modals.length > 0) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [modals, closeModal]);

  // Prevent body scrolling when modals are open
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [modals.length]);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    showConfirmDialog,
    showAlert,
    activeModalCount: modals.length,
  };
};