import EmptyState from '../EmptyState';
import UserLayout from './UserLayout';

const Users = () => {
  return (
    <UserLayout>
      <div className='lg:block h-full lg:pl-80'>
        <EmptyState />
      </div>
    </UserLayout>
  );
};

export default Users;
