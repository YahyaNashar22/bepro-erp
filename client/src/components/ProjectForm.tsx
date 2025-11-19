/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import type { IClient } from "../interfaces/IClient";
import type { ProjectStatusEnum } from "../Enums/ProjectStatusEnum";
import type { ProjectType } from "../Enums/ProjectTypeEnum";
import type { ProjectSourceEnum } from "../Enums/ProjectSourceEnum";
import type { CurrencyEnum } from "../Enums/CurrencyEnum";
import type { IUser } from "../interfaces/IUser";

const ProjectForm = () => {
  const [formData, setFormData] = useState<any>({
    name: "",
    client_id: "",
    responsible: "",
    status: "new",
    type: "lead",
    source: "not selected",
    budget: "",
    currency: "USD",
    quotation_file: "",
    image: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, setLoadingClients] = useState(true);
  const [clients, setClients] = useState<IClient[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [, setLoadingUsers] = useState(true);

  const handleFetchClients = async () => {
    try {
      const res = await api.post("/client/all");
      setClients(res.data.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleFetchUsers = async () => {
    try {
      const res = await api.post("/user/all");
      setUsers(res.data.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    handleFetchClients();
    handleFetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload quotation file
  const handleQuotationUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await api.post("/upload/quotation", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev: any) => ({
        ...prev,
        quotation_file: res.data.payload,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await api.post("/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev: any) => ({ ...prev, image: res.data.payload }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await api.post("/project/create", formData);
      if (res.status === 201) alert("Project Created!");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create Project</h2>

      <div className="flex flex-col gap-4">
        {/* Project Name */}
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        {/* Select Client */}
        <select
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Select User */}
        <select
          name="responsible"
          value={formData.responsible}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          <option value="">Select Responsible User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Project Status */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          {(
            [
              "contacted",
              "quoted",
              "approved",
              "declined",
              "new",
              "qualified",
              "converted",
              "lost",
              "closed",
              "pending",
              "awaiting payment",
            ] as ProjectStatusEnum[]
          ).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Project Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          {(
            [
              "sale",
              "purchase",
              "rental",
              "subscription",
              "service",
              "consulting",
              "maintenance",
              "upgrade",
              "renewal",
              "refund",
              "exchange",
              "trial",
              "lead",
              "follow_up",
            ] as ProjectType[]
          ).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Project Source */}
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          {(
            [
              "not selected",
              "website",
              "facebook",
              "instagram",
              "tiktok",
              "google_ads",
              "referral",
              "walk_in",
              "email_campaign",
              "cold_call",
              "whatsapp",
              "linkedin",
              "partner",
              "event",
              "other",
            ] as ProjectSourceEnum[]
          ).map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {/* Budget */}
        <input
          type="number"
          name="budget"
          placeholder="Budget Amount"
          value={formData.budget}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        />

        {/* Currency */}
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md"
        >
          {(
            [
              "AED",
              "SAR",
              "QAR",
              "KWD",
              "BHD",
              "OMR",
              "EGP",
              "LYD",
              "DZD",
              "TND",
              "MAD",
              "SDG",
              "SOS",
              "DJF",
              "IQD",
              "SYP",
              "LBP",
              "YER",
              "JOD",
              "USD",
              "EUR",
              "GBP",
              "CAD",
              "AUD",
              "NZD",
              "CHF",
              "JPY",
              "CNY",
              "INR",
              "TRY",
              "RUB",
              "BRL",
              "MXN",
              "ZAR",
            ] as CurrencyEnum[]
          ).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Upload Quotation */}
        <div>
          <label className="text-sm">Upload Quotation</label>
          <input
            type="file"
            onChange={handleQuotationUpload}
            className="mt-1 block w-full text-sm"
          />
          {formData.quotation_file && (
            <p className="text-green-400 text-xs mt-1">
              Uploaded: {formData.quotation_file}
            </p>
          )}
        </div>

        {/* Upload Image */}
        <div>
          <label className="text-sm">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm"
          />
          {formData.image && (
            <p className="text-green-400 text-xs mt-1">
              Uploaded: {formData.image}
            </p>
          )}
        </div>

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="bg-[#1a1a1a] border border-gray-700 p-2 rounded-md h-24"
        />

        <button
          disabled={submitting}
          onClick={handleSubmission}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-3 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Create Project"}
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
