import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <Component {...props} /> : null;
  };

  // Đặt tên hiển thị cho component (để dễ debug)
  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || 'Component'
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
