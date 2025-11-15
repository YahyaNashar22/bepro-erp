import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v1",
  withCredentials: true,
});

// response interceptor for auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT refresh if:
    // 1) already refreshing
    // 2) the failed request is the refresh endpoint
    // 3) user is logged out (no refresh cookie)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.get("/user/refresh", {
          withCredentials: true,
        });

        // update access token if backend returns a new one
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        // refresh failed, user is logged out
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
