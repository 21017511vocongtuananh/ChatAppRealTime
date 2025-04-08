import BodyUser from '../FriendUser/BodyUser';
import HeaderUser from '../FriendUser/HeaderUser';

const ListFriendAndGroup = () => {
  return (
    <div className='h-full'>
      <div className='h-full flex flex-col'>
        <HeaderUser />
        <BodyUser />
      </div>
    </div>
  );
};

export default ListFriendAndGroup;
