import { useRoutes } from '../../routers/routers';
import { useState } from 'react';
import DesktopItem from './DesktopItem';
import Avatar from '../Avartar/Avatar';
import SettingsModal from './SettingsModal';
import { ExternalLink } from 'lucide-react';
import UpdatePassword from './UpdatePassword';

const DesktopSidebar = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <UpdatePassword
        currentUser={currentUser}
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <div className='absolute  inset-y-0 left-0 z-40 w-20 px-6 bg-[#005AE0] border-r pb-4 flex flex-col justify-between'>
        <nav className='mt-4 flex flex-col justify-between'>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            <div className='relative'>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className='cursor-pointer hover:opacity-75 transition'
              >
                <Avatar user={currentUser} />
              </div>

              {showMenu && (
                <div className='absolute left-[61px]   top-0 w-64 bg-white rounded-lg shadow-xl z-[9999] text-sm'>
                  <div className='px-4 py-3 font-semibold border-b text-black'>
                    {currentUser?.name || 'Tên người dùng'}
                  </div>
                  <ul className='py-1 text-black'>
                    <li
                      className='flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        setIsPasswordOpen(true);
                        setShowMenu(false);
                      }}
                    >
                      <span>Đổi mật khẩu</span>
                      <ExternalLink size={16} className='text-gray-400' />
                    </li>
                    <li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        setIsOpen(true);
                        setShowMenu(false);
                      }}
                    >
                      Hồ sơ của bạn
                    </li>
                    <li
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        alert('Đi tới cài đặt');
                        setShowMenu(false);
                      }}
                    >
                      Cài đặt
                    </li>
                    <hr className='my-1' />
                    <li className='px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer'>
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {routes.map((item) => (
              <DesktopItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
