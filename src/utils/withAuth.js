import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        router.push('/login'); // Redireciona para o login se o usuário não estiver autenticado
      }
    }, [router]);

    return <Component {...props} />;
  };
}