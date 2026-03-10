import { useState, useCallback } from 'react';

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    try {
      const id = Date.now() + Math.random();
      const toast = { id, message, type };

      setToasts(prev => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
      }

      return id;
    } catch (error) {
      console.error('Error in addToast:', error);
      return null;
    }
  }, []);

  const removeToast = useCallback((id) => {
    try {
      setToasts(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error in removeToast:', error);
    }
  }, []);

  return { toasts, addToast, removeToast };
}
