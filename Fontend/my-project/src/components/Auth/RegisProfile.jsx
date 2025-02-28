import { useState } from "react";
import axios from "axios";
import { DatePicker } from "antd";

const RegisProfile = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "male",
        birthDate: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date, dateString) => {
        setFormData({ ...formData, birthDate: dateString });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_URL + "/api/profile",
                formData
            );
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to save profile.");
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
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
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