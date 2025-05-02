import { lazy, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import useConversation from '../hooks/useConversation.js';
import withAuth from '../hoc/withAuth';
import ConversationLayout from '../components/Convertion/ConversationLayout.jsx';
import { useWebSocket } from '../components/Message/WebSocketContext.jsx';
import ApiService from '../services/apis.js';
import { message } from 'antd';

// Load các component động
const User = lazy(() => import('../components/Users/User.jsx'));
const Login = lazy(() => import('../components/Auth/Login.jsx'));
const Register = lazy(() => import('../components/Register.jsx'));
const RegisProfile = lazy(() => import('../components/Auth/RegisProfile.jsx'));
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
const Conversation = lazy(() =>
  import('../components/Convertion/Conversation.jsx')
);

const useRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversationId } = useConversation();
  const { disconnect } = useWebSocket();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        disconnect();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        navigate('/');
        await ApiService.loggout(token);
      }
      message.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout failed:', error.message);
      message.error('Đăng xuất thất bại. Vui lòng thử lại.');
    }
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
  {
    path: '/conversations',
    component: Conversation
  },
  { path: '/user', component: withAuth(User) },
  {
    path: '/conversations/:conversationId',
    component: withAuth(() => (
      <ConversationLayout>
        <ConversationId />
      </ConversationLayout>
    ))
  },
  { path: '/reset-password', component: ResetPassword },
  { path: '/set-password', component: RegisPassword },
  { path: '/regis-profile', component: RegisProfile }
];

export { useRoutes, routers };
