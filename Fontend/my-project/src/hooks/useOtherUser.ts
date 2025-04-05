import { useEffect, useState, useMemo } from 'react';
import usePhoneNumber from './usePhoneNumber.js';

const useOtherUser = (conversation) => {
  const { phone } = usePhoneNumber();

  const otherUsers = useMemo(() => {
    const otherUsers = conversation.users.filter(
      (users) => users.phoneNumber !== phone
    ); // Lấy tất cả người khác
    return otherUsers[0];
  }, [phone, conversation.users]);
  return otherUsers;
};

export default useOtherUser;
