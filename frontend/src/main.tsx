import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_obiOiXhAM",
  client_id: "1ajp01e3a2d738kmtd9npejubt",
  redirect_uri: window.location.href,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
