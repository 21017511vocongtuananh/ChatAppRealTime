import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apis';

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = ApiService.isAuthenticated;

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/');
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <Component {...props} /> : null;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || 'Component'
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
