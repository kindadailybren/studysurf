import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './styles/index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_5W8Cqs9mB",
  client_id: "2624i7473vacjrqr90a4km7hde",
  redirect_uri: window.location.href,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
)
