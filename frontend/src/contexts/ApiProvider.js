import { createContext, useContext } from 'react';
import ListAppApiClient from '../ListAppApiclient';

const ApiContext = createContext();

/**
 * Provides the API context to the application.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The API context provider component.
 */
export default function ApiProvider({ children }) {
  const api = new ListAppApiClient();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}