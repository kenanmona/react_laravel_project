import axios from "axios";

const client = axios.create({ baseURL: "http://127.0.0.1:8000" });

const user = () => {
  let token = JSON.parse(localStorage.getItem("user"));
  return token?.access_token;
};

export const request = async ({ ...options }) => {
  const token = await user();
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
  const onSuccess = (response) => response;
  const onError = (error) => {
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};
