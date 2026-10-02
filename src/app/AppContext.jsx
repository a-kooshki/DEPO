import { createContext, useContext } from 'react';

/**
 * The shell owns persistence and cross-tab actions. Tab views consume this
 * context so moving a view never changes its behavior or creates prop drilling.
 */
export const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('Tab views must be rendered inside AppContext.');
  return context;
}
