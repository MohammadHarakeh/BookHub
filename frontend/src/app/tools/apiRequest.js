import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";

export const sendRequest = async (method, route, body) => {
  let headers = {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  };

  let requestData = {};

  if (body instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
    requestData = {
      method: method,
      url: route,
      data: body,
      headers: headers,
    };
  } else {
    headers["Content-Type"] = "application/json";
    requestData = {
      method: method,
      url: route,
      data: body,
      headers: headers,
    };
  }

  //add this remove the above
  // requestData = {
  //   method: method,
  //   url: route,
  //   data: body,
  //   headers: headers,
  // };

  const response = await axios.request(requestData);
  return response;
};
