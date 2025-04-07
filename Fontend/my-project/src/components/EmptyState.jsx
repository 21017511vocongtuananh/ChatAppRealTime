import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import '../../style/swiper.css';
import { Navigation, Autoplay } from 'swiper/modules';

const EmptyState = () => {
  return (
    <div className='h-full justify-center items-center bg-gray-100 relative'>
      <Swiper
        navigation={true}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        loop={true}
        modules={[Navigation, Autoplay]}
        className='mySwiper'
      >
        <SwiperSlide>
          <div className='flex flex-col items-center'>
            <img
              src='https://chat.zalo.me/assets/inapp-welcome-screen-06-darkmode.336078e876ae12bf42474586745397f0.png'
              alt=''
              className='swiper-image'
            />
            <div className='text-lg font-semibold mt-4 text-blue-500'>
              Giao diện Dark Mode
            </div>
            <div className='text-sm text-center mt-2 px-4'>
              Thư giãn và bảo vệ mắt với chế độ giao diện tối mới trên Zalo PC
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='flex flex-col items-center'>
            <img
              src='https://chat.zalo.me/assets/zbiz_onboard_vi_3x.62514921c8505730d07aff3fa8c4e9c3.png'
              alt=''
              className='swiper-image'
            />
            <div className='text-lg font-semibold mt-4 text-blue-500'>
              Kinh doanh hiệu quả với zBusiness Pro
            </div>
            <div className='text-sm text-center mt-2 px-4'>
              Bán hàng chuyên nghiệp với Nhãn Business và Bộ công cụ kinh doanh,
              mở khóa tiềm năng tiếp cận khách hàng trên Zalo
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='flex flex-col items-center'>
            <img
              src='https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png'
              alt=''
              className='swiper-image'
            />
            <div className='text-lg font-semibold mt-4 text-blue-500'>
              Nhắn tin nhiều hơn, soạn thảo ít hơn
            </div>
            <div className='text-sm text-center mt-2 px-4'>
              Sử dụng Tin Nhắn Nhanh để lưu sẵn các tin nhắn thường dùng và gữi
              nhanh trong hội thoại bất kỳ
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='flex flex-col items-center'>
            <img
              src='https://chat.zalo.me/assets/inapp-welcome-screen-04.1e316ea11f2bfc688dd4edadb29b9750.png'
              alt=''
              className='swiper-image'
            />
            <div className='text-lg font-semibold mt-4 text-blue-500'>
              Trải nghiệm xuyên suốt
            </div>
            <div className='text-sm text-center mt-2 px-4'>
              Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu luôn
              được đồng bộ
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className='flex flex-col items-center'>
            <img
              src='https://chat.zalo.me/assets/inapp-welcome-screen-03.ba238595e7a8186393b3f47805a025eb.png'
              alt=''
              className='swiper-image'
            />
            <div className='text-lg font-semibold mt-4 text-blue-500'>
              Gữi File nặng ?
            </div>
            <div className='text-sm text-center mt-2 px-4'>
              Đã có Zalo PC "xử" hết
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default EmptyState;
