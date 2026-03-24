import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles/input.css'
import App from './App.tsx'
import { store } from './store/store'
import { LibraryProvider } from './contexts/LibraryContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
