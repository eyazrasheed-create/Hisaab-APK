import { useEffect, useRef } from 'react';

type BackHandler = {
  id: string;
  onBack: () => void;
  name: string;
};

const handlersStack: BackHandler[] = [];
let isPoppingFromBrowser = false;

// Global single popstate listener
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', (e) => {
    if (handlersStack.length > 0) {
      isPoppingFromBrowser = true;
      const top = handlersStack.pop();
      if (top) {
        try {
          top.onBack();
        } catch (err) {
          console.error('Error in back handler:', err);
        }
      }
      setTimeout(() => {
        isPoppingFromBrowser = false;
      }, 60);
    }
  });
}

/**
 * Custom hook to support Android Gesture Navigation (edge swipe back) & Hardware Back button.
 * When `isActive` is true, pushes a state to history.
 * When user swipes back on mobile, intercepts popstate and calls `onBack`.
 * If closed programmatically (via UI button), cleans up the pushed history entry smoothly.
 */
export function useMobileBackHandler(isActive: boolean, onBack: () => void, debugName = 'screen') {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const pushedRef = useRef(false);
  const idRef = useRef(`back_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

  useEffect(() => {
    if (!isActive) return;

    // Push history entry
    try {
      window.history.pushState({ backHandlerId: idRef.current, name: debugName }, '');
      pushedRef.current = true;
    } catch (e) {
      console.warn('Could not push history state', e);
    }

    const handlerItem: BackHandler = {
      id: idRef.current,
      name: debugName,
      onBack: () => {
        pushedRef.current = false;
        onBackRef.current();
      },
    };

    handlersStack.push(handlerItem);

    return () => {
      // Find and remove from stack
      const idx = handlersStack.findIndex((h) => h.id === idRef.current);
      if (idx !== -1) {
        handlersStack.splice(idx, 1);
      }

      // If closed by UI action (not by browser popstate), roll back history
      if (pushedRef.current && !isPoppingFromBrowser) {
        pushedRef.current = false;
        try {
          window.history.back();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isActive, debugName]);
}
