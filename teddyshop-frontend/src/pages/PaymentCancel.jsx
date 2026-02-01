import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>❌ Thanh toán bị huỷ</h2>
      <button onClick={() => navigate("/checkout")}>
        Quay lại thanh toán
      </button>
    </div>
  );
}
