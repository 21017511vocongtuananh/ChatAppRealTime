import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const DesktopItem = ({ label, icon: Icon, href, onClick, active }) => {
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        to={href}
        className={clsx(
          'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-[#0043A8]',
          active && 'bg-[#0043A8] text-black'
        )}
      >
        <Icon className='h-6 w-6 shrink-0 text-white' />
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
