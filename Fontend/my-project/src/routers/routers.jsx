import { lazy, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import useConversation from '../hooks/useConversation.jsx';
import withAuth from '../hoc/withAuth.jsx';
import Conversations from '../components/Convertion/Conversation.jsx';
import ConversationLayout from '../components/Convertion/ConversationLayout.jsx';

// Load các component động
const User = lazy(() => import('../components/users/User.jsx'));
const Login = lazy(() => import('../components/Auth/Login.jsx'));
const Register = lazy(() => import('../components/Register.jsx'));
const SendOTP = lazy(() => import('../components/Auth/SendOTP.jsx'));
const ResetPassword = lazy(() =>
  import('../components/Auth/ResetPassword.jsx')
);
const RegisPassword = lazy(() =>
  import('../components/Auth/RegisPassword.jsx')
);
const ConversationId = lazy(() =>
  import('../components/Convertion/ConversationId.jsx')
);
const useRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = useConversation();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token nếu có
    navigate('/');
  };

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: location.pathname === '/conversations' || !!conversationId
      },
      {
        label: 'Users',
        href: '/user',
        icon: HiUsers,
        active: location.pathname === '/user'
      },
      {
        label: 'Logout',
        href: '#',
        onClick: handleLogout,
        icon: HiArrowLeftOnRectangle
      }
    ],
    [location.pathname, conversationId]
  );

  return routes;
};

// ✅ Định nghĩa danh sách route
const routers = [
  { path: '/', component: Login },
  { path: '/auth/register', component: Register },
  { path: '/auth/sendOTP', component: SendOTP },
  { path: '/user', component: withAuth(User) },
  {
    path: '/conversations',
    component: withAuth(() => (
      <ConversationLayout>
        <Conversations />
      </ConversationLayout>
    ))
  },
  {
    path: '/conversations/:id',
    component: withAuth(() => (
      <ConversationLayout>
        <ConversationId />
      </ConversationLayout>
    ))
  },
  { path: '/reset-password', component: ResetPassword },
  { path: '/set-password', component: RegisPassword }
];

export { useRoutes, routers };
