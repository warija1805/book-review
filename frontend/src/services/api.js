import axios from "axios";

const API_BASE_URL = "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

// Books API calls
export const booksAPI = {
  getAllBooks: async () => {
    const response = await api.get("/books");
    return response.data;
  },

  getBookById: async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  },
};

// Reviews API calls
export const reviewsAPI = {
  addReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  getReviewsForBook: async (bookId) => {
    const response = await api.get(`/reviews/${bookId}`);
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get("/reviews/user/me");
    return response.data;
  },
};

export default api;
