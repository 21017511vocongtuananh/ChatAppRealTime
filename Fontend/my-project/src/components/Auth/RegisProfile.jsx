import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker, message } from "antd";

const RegisProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        image: "https://example.com/default-avatar.jpg", // Ảnh mặc định
        gender: "male",
        dateOfBirth: ""
    });

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        const storedPassword = localStorage.getItem("password");

        if (storedEmail && storedPassword) {
            setFormData(prevData => ({
                ...prevData,
                email: storedEmail,
                password: storedPassword
            }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, dateOfBirth: dateString });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL + "/api/auth/register";
            console.log("🔹 Sending request to:", apiUrl);
            console.log("🔹 Data being sent:", formData);

            const response = await axios.post(apiUrl, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201 || response.status === 200) {
                message.success("Hồ sơ đã được lưu thành công!");
                navigate("/");
            }
        } catch (error) {
            console.error("❌ Error saving profile:", error.response?.data || error.message);
            message.error("Lưu hồ sơ thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
                <img
                    src="https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-hai-huoc-2.jpg"
                    alt="Avatar" />

                <h2 className="text-xl font-semibold mb-4">Nhập Thông Tin Cá Nhân</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <div className="mb-2">
                    <label className="mr-2">Giới tính:</label>
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                    /> Nam
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="ml-2"
                    /> Nữ
                </div>
                <DatePicker
                    className="w-full p-2 mb-4 border rounded"
                    placeholder="Chọn ngày sinh"
                    onChange={handleDateChange}
                />
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Lưu
                </button>
            </form>
        </div>
    );
};

export default RegisProfile;
