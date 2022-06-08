const axios = require("axios");
const RPC_URL =
  window.RPC === 1 ? `${location.origin}/rpc` : "http://127.0.0.1:4698/rpc";

export async function RPC(method, params = []) {
  try {
    const response = await axios.post(
      RPC_URL,
      {
        jsonrpc: "2.0",
        id: +new Date().getTime() * 1000 + Math.round(Math.random() * 1000),
        method,
        params,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response.data.error) {
      throw new Error(
        `RPC error: ${method} ${JSON.stringify(params)} ${JSON.stringify(
          response.data
        )}`
      );
    }
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
}
