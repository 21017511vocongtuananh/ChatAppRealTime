Features

🔐 Authentication & Security

User authentication with JWT & OAuth2

OTP email verification

💬 Real-time Messaging

1-on-1 chat & group chat using WebSocket (STOMP protocol)

Pin important messages

📂 Media Sharing

Send & receive images, videos, files

Integration with AWS S3 for storage

📹 Video Call

One-on-one video calling using ZegoCloud SDK

🖥️ Modern UI/UX

Built with React, TypeScript, Redux Toolkit, TailwindCSS, Ant Design, and MUI

🛠️ Tech Stack

Frontend

ReactJS, TypeScript

Redux Toolkit

Tailwind CSS + Ant Design + Material UI

Backend

Spring Boot (Java)

WebSocket (STOMP protocol)

NoSQL Database (MongoDB/Redis)

Docker

Other Services

AWS S3 (media storage)

ZegoCloud SDK (video call)

JWT & OAuth2 (authentication & authorization)

⚙️ Requirements

Node.js >= 18

Java >= 21

Maven >= 3.9.5

Docker & Docker Compose

NoSQL Database (MongoDB recommended)

AWS S3 account (for file storage)

ZegoCloud account (for video call API key & secret)

📥 Installation & Setup
1️⃣ Clone repository
git clone https://github.com/21017511vocongtuananh/ChatAppRealTime.git
cd ChatAppRealTime

2️⃣ Backend Setup (Spring Boot)

Go to backend directory:

cd backend


Configure application properties (src/main/resources/application.yml):

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/chatapp
  security:
    jwt:
      secret: your_jwt_secret
      expiration: 86400000
cloud:
  aws:
    s3:
      bucket: your-bucket-name
      access-key: your-access-key
      secret-key: your-secret-key
zego:
  appId: your_zegocloud_app_id
  appSign: your_zegocloud_app_sign


Build & run with Maven:

mvn clean install
mvn spring-boot:run


Backend will start at: http://localhost:8080

3️⃣ Frontend Setup (React + TypeScript)

Go to frontend directory:

cd frontend


Install dependencies:

npm install


Create .env file:

VITE_API_BASE_URL=http://localhost:8080/api
VITE_ZEGOCLOUD_APP_ID=your_app_id
VITE_ZEGOCLOUD_SERVER_SECRET=your_server_secret


Run development server:

npm run dev


Frontend will start at: http://localhost:5173

4️⃣ Run with Docker (Optional)
docker-compose up --build

📸 Screenshots

(Thêm ảnh giao diện nếu có: đăng nhập, chat, video call, group chat, etc.)

📌 Roadmap

✅ Real-time messaging

✅ File & media sharing

✅ Video call 1-1

🔜 Group video call

🔜 Message reactions & notifications

📚 Documentation

Spring Boot

ReactJS

Redux Toolkit

ZegoCloud SDK

AWS S3

🤝 Contributing

Contributions are welcome! Feel free to fork and submit a pull request.

📄 License

This project is licensed under the MIT License.

🔗 Link

GitHub Repo: ChatAppRealTime
