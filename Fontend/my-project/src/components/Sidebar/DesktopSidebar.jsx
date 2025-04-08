import { useRoutes } from '../../routers/routers';
import { useState, useEffect } from 'react';
import DesktopItem from './DesktopItem';
import Avatar from '../Avartar/Avatar';
import SettingsModal from './SettingsModal';
const DesktopSidebar = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className='
      fixed
      inset-y-0
      left-0
      z-40
      w-20
      px-6
      overflow-y-auto
      bg-[#005AE0]
      border-r-[1px]
      pb-4
      flex
      flex-col
      justify-between
      lg:w-20
      lg:px-6
    '
      >
        <nav className='mt-4 flex flex-col justify-between'>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            <div
              onClick={() => setIsOpen(true)}
              className='
          cursor-pointer
          hover:opacity-75
          transition'
            >
              <Avatar user={currentUser} />
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
