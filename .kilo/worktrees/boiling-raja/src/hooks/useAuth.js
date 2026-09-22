const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Aquí puedes hacer una llamada a tu backend para verificar el token
      // Si el token es válido, puedes establecer el usuario en el estado
      // setUser({ username: 'tu_usuario' });
    }
  }, []);

  return { user };
};

export default useAuth;
