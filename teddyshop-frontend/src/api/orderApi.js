import cartAxiosClient from "../utils/cartAxiosClient"; 

export const orderApi = {
  createOrder: (data) => cartAxiosClient.post("/order", data),
  getMyOrders: () => cartAxiosClient.get("/order/my-orders"),
    checkPayment: (orderId) => cartAxiosClient.get(`/order/check-payment/${orderId}`)
};
