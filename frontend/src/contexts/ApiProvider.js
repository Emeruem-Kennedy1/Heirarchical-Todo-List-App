import { createContext, useContext } from 'react';
import ListAppApiClient from '../ListAppApiclient';

const ApiContext = createContext();

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