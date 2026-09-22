import { useState, useEffect } from "../lib/exports";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        // if (token) {
        //   const response = await axios.get('http://localhost:5000/api/auth', {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   });
        //   setIsAuthenticated(true);
        // } else {
        //   setIsAuthenticated(false);
        // }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, loading };
};
