import CustomButton from '@components/Button/Button';
import Input from '@components/Input/Input';
import Select from '@components/Input/Select';
import Modal from '@components/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const GroupChatModal = ({ isOpen, onClose, users }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form>
          <div className='space-y-12'>
            <div className='border-b border-gray-900/10 pb-12'>
              <h2
                className='
                text-base
                font-semibold
                leading-7
                text-gray-900
                
              '
              >
                Tạo Nhóm
              </h2>
              <div
                className='
                mt-10
                flex
                flex-col
                gap-y-8
              '
              >
                <Input
                  register={register}
                  label='Name'
                  id='name'
                  disabled={isLoading}
                  required
                  errors={errors}
                />
                <Select
                  disabled={isLoading}
                  label='Members'
                  options={users.map((user) => ({
                    value: user.id,
                    label: user.name
                  }))}
                  onChange={(value) =>
                    setValue('members', value, {
                      shouldValidate: true
                    })
                  }
                  value={members}
                />
              </div>
            </div>
          </div>
          <div
            className='
            mt-6
            flex
            items-center
            justify-end
            gap-x-6
          '
          >
            <CustomButton
              disabled={isLoading}
              onClick={onClose}
              type='button'
              color='red'
              secondary
            >
              Hủy
            </CustomButton>
            <CustomButton disabled={isLoading} type='submit'>
              Tạo Nhóm
            </CustomButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
