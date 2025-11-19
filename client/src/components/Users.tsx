import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import type { IUser } from "../interfaces/IUser";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);

  const handleFetch = async () => {
    try {
      const res = await api.post("/user/all");
      setUsers(res.data.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
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
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="p-4 border border-gray-700 rounded-lg bg-[#1a1a1a]"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-medium">{user.username}</p>

                  <p className="text-sm text-gray-400">
                    {user.email || "No email"}
                  </p>

                  <p className="text-sm text-gray-400">
                    {user.phone || "No phone"}
                  </p>

                  <p className="text-sm text-gray-400 capitalize">
                    Role: {user.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Show details for ${user._id}`)}
                >
                  Details
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Edit user ${user._id}`)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user._id)}
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

export default Users;
