import { useState } from "react";
import api from "../utils/axiosInstance";

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/user/create", formData);
      if (res.status === 201) alert("User Created!");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create User</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          disabled={submitting}
          onClick={handleSubmission}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-3 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Create User"}
        </button>
      </div>
    </div>
  );
};

export default UserForm;
