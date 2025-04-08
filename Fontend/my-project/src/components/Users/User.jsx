import ListFriendAndGroup from './ListFriendAndGroup';
import UserLayout from './UserLayout';

const Users = () => {
  return (
    <UserLayout>
      <div className='lg:pl-80 h-full lg:block'>
        <ListFriendAndGroup />
      </div>
    </UserLayout>
  );
};

export default Users;
