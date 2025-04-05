import clsx from 'clsx';
import useConversation from '../../hooks/useConversation.js';
import EmptyState from '../EmptyState';
import ConversationLayout from './ConversationLayout';

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <ConversationLayout>
      <div
        className={clsx(
          'lg:pl-80 h-full lg:block',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <EmptyState />
      </div>
    </ConversationLayout>
  );
};

export default Home;
