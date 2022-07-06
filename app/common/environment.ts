import dotenv from "dotenv";

export const Environment = {
  Dev: {
    host: process.env.HOST, // URL for the backend
    apiBase: "/api/v1",
  },
};
