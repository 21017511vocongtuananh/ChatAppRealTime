import EmptyState from '../EmptyState';
import UserLayout from './UserLayout';

const Users = () => {
  return (
    <UserLayout>
      <div className='lg:pl-80 h-full lg:block'>
        <EmptyState />
      </div>
    </UserLayout>
  );
};

export default Users;
