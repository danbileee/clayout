import axios, { type CreateAxiosDefaults } from "axios";

const baseConfig: CreateAxiosDefaults = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
};

function createClientAxiosInstance() {
  return axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    ...baseConfig,
  });
}

function createServerAxiosInstance() {
  return axios.create({
    baseURL: process.env.VITE_API_HOST,
    ...baseConfig,
  });
}

export function createAxiosInstance() {
  if (typeof window !== "undefined" && typeof import.meta !== "undefined") {
    return createClientAxiosInstance();
  } else {
    return createServerAxiosInstance();
  }
}
