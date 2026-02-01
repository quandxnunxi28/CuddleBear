import axios from 'axios';

const orderAxiosClient = axios.create({
  baseURL: 'https://cuddleshop-c7g8e3exb6eqa8dq.southeastasia-01.azurewebsites.net/api',
  withCredentials: true, // gửi cookie
});

// ví dụ checkout
export const checkout = async (orderData) => {
  const response = await orderAxiosClient.post('/order', orderData);
  return response.data;
};
export default orderAxiosClient;
