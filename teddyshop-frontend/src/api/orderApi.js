import axios from "../utils/axiosClient"; 

export const orderApi = {
  createOrder: (data) => axios.post("/api/order", data),
  getMyOrders: () => axios.get("/api/order/my-orders")
};
