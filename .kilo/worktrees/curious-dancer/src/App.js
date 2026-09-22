import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  const { pathname } = useLocation();

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };

  return (
    <div className="bg-white min-h-svh">
      <ScrollToTop />
      <AppRoutes />
    </div>
  );
}

export default App;
