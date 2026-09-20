import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

/**
 * Root of the app. Providers (react-query client, theme) are reserved as
 * src/app/providers/* — wrap <RouterProvider> with them once implemented.
 */
export function App() {
  return <RouterProvider router={router} />;
}
