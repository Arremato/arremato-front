import { useEffect, useState } from 'react';
import CustomAppBar from '../components/AppBar';
import withAuth from '../utils/withAuth';

export default function MyApp({ Component, pageProps, router }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Define como true se o token existir
  }, []);

  // Aplica o HOC apenas nas rotas protegidas
  const ProtectedComponent = router.pathname === '/login' ? Component : withAuth(Component);

  return (
    <>
      {isLoggedIn && router.pathname !== '/login' && (
        <CustomAppBar userName={sessionStorage.getItem('userName') || 'Usuário'} />
      )}
      <main style={isLoggedIn ? { marginLeft: '250px', padding: '16px' } : { padding: '16px' }}>
        <ProtectedComponent {...pageProps} />
      </main>
    </>
  );
}