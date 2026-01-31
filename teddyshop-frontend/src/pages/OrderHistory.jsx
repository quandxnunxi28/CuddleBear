import { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import "./OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;

  if (orders.length === 0)
    return <p>Bạn chưa có đơn hàng nào</p>;

  return (
    <div className="order-history">
      <h2>Lịch sử đơn hàng</h2>

      {orders.map(order => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <span>Đơn #{order.id}</span>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>

          <p><b>Ngày:</b> {new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Địa chỉ:</b> {order.shippingAddress}</p>
          <p><b>Thanh toán:</b> {order.statusFee}</p>

          <ul className="order-items">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.productName} × {item.quantity} –{" "}
                {item.price.toLocaleString()} đ
              </li>
            ))}
          </ul>

          <div className="order-total">
            Tổng tiền: {order.totalAmount.toLocaleString()} đ
          </div>
        </div>
      ))}
    </div>
  );
}
