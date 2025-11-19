import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import type { IClient } from "../interfaces/IClient";

const Clients = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<IClient[]>([]);

  const handleFetch = async () => {
    try {
      const res = await api.post("/client/all");
      setClients(res.data.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;

    try {
      await api.delete(`/client/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clients</h2>

      {clients.length === 0 ? (
        <p>No clients found</p>
      ) : (
        <ul className="space-y-4">
          {clients.map((client) => (
            <li
              key={client._id}
              className="p-4 border border-gray-700 rounded-lg bg-[#1a1a1a]"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-medium">{client.name}</p>
                  <p className="text-sm text-gray-400">{client.company_name}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Show details for ${client._id}`)}
                >
                  Details
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Edit client ${client._id}`)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(client._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Clients;
