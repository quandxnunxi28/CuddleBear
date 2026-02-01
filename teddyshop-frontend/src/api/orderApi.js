import axios from "../utils/axiosClient"; 

export const orderApi = {
  createOrder: (data) => axios.post("/order", data),
  getMyOrders: () => axios.get("/order/my-orders"),
    checkPayment: (orderId) => axios.get(`/order/check-payment/${orderId}`)
};
