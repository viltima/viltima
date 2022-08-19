import { HOST_URL } from "@env";

export const Environment = {
  Dev: {
    host: `${HOST_URL}`, // URL for the backend
    apiBase: "/api/v1",
  },
};
