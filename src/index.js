import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import '@fontsource/libre-franklin';
import { Bounce, ToastContainer } from 'react-toastify';
import 'swiper/css';
import { AuthProvider } from './Context/AuthContext';
import { Router, Toaster } from './utils/imports';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Toaster
      toastOptions={{ className: 'no-swipe' }}
      theme="light"
      position="top-right"
      reverseOrder={false}
      richColors
    />
    <AuthProvider>
      <ToastContainer position="top-right" theme="light" transition={Bounce} closeOnClick={true} />
     <HelmetProvider>
  <App />
</HelmetProvider>
    </AuthProvider>
  </Router>
);

reportWebVitals();
