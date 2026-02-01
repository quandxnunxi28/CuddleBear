import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import { useCartStore } from "../store/cartStore";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState("Đang kiểm tra thanh toán...");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("orderCode");
    if (!orderId) return setStatus("Order ID không hợp lệ");

    const checkPayment = async () => {
      try {
        const res = await orderApi.checkPayment(orderId);
        console.log("Payment check response:", res);
        if (res.data.status === "PAID") {
          setStatus("Thanh toán thành công!");
          clearCart();
          // Tự động chuyển sang trang orders sau 2s
          setTimeout(() => navigate("/order"), 10000);
        } else {
          setStatus("Chưa thanh toán, vui lòng chờ hoặc thử lại.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Có lỗi xảy ra, vui lòng thử lại.");
      }
    };

    checkPayment();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}
