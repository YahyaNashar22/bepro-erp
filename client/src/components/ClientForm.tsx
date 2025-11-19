import { useState } from "react";
import api from "../utils/axiosInstance";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    company_name: "",
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/client/create", formData);
      if (res.status === 201) alert("Client Created!");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create Client</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        <button
          disabled={submitting}
          onClick={handleSubmission}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-3 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Create Client"}
        </button>
      </div>
    </div>
  );
};

export default ClientForm;
