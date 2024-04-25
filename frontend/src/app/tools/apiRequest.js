import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

export const sendRequest = async (method, route, body) => {
  const response = await axios.request({
    method: method,
    url: route,
    data: body,
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      "Content-Type": "application/json",
    },
  });

  return response;
};
