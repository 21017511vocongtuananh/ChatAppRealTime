import clsx from 'clsx';
import usePhoneNumber from '../../hooks/usePhoneNumber';
import Avatar from '@components/Avatar';
import { format } from 'date-fns';
import { Button, Image } from 'antd';

const MessageBox = ({ data, isLast }) => {
  const { phone } = usePhoneNumber();
  const isOwn = phone === data.sender.phoneNumber;
  const isVideo = data.image?.endsWith('.mp4');
  const isFile = data.image?.endsWith('.pdf');

  const seenList = (data.seen || [])
    .filter((user) => user.phone !== data.sender.phoneNumber)
    .map((user) => user.name)
    .join(', ');

  const container = clsx(
    'flex gap-3 p-4',
    isOwn ? 'justify-end' : 'justify-start'
  );
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx(
    'flex flex-col gap-1 bg-gray-100 shadow-sm rounded-lg p-2 w-fit min-w-[100px] max-w-[75%] break-words',
    isOwn && 'items-end',
    data.image && 'bg-white !shadow-none'
  );
  const message = clsx(
    'text-sm w-fit overflow-hidden break-all',
    isOwn ? 'text-black' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'py-2'
  );
  const time = clsx(
    'text-sm flex items-center justify-between text-gray-400 w-full ',
    isOwn ? 'flex-row' : 'flex-row-reverse'
  );

  const renderMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 underline break-all'
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className={container}>
      {!isOwn && (
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
      )}
      <div className={body}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{data.sender.name}</div>
        </div>
        <div className={message}>
          {data.image ? (
            isVideo ? (
              <video
                controls
                width={285}
                height={300}
                className='object-cover cursor-pointer hover:scale-110 transition transform border rounded-2xl'
              >
                <source src={data.image} type='video/mp4' />
              </video>
            ) : isFile ? (
              <div
                className='p-2 border rounded-lg bg-gray-200 flex flex-col items-center'
                style={{ height: '100px', width: '300px' }}
              >
                <span className='text-sm text-gray-700 mb-2'>📄 File PDF</span>
                <Button type='primary' style={{ width: '200px' }}>
                  <a
                    href={data.image}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Xem file
                  </a>
                </Button>
              </div>
            ) : (
              <Image
                alt='Image'
                src={data.image}
                width={285}
                height={300}
                className='object-cover cursor-pointer hover:scale-110 transition transform border rounded-2xl'
              />
            )
          ) : (
            <div>{renderMessage(data.body)}</div>
          )}
        </div>
        <div className={time}>
          <button className='text-2xl font-bold text-gray-500'>...</button>
          <span className='text-[12px] self-end'>
            {format(new Date(data.createdAt), 'h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
