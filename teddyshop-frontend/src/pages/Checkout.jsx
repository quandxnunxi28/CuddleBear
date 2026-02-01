  import { useEffect, useState } from "react";
  import { useCartStore } from "../store/cartStore";
  import { orderApi } from "../api/orderApi";
  import "./Checkout.css";
  import { useNavigate } from "react-router-dom";

  export default function Checkout() {
    // Cart store
    const navigate = useNavigate();
    const cartItems = useCartStore(state => state.cartItems);
    const fetchCart = useCartStore(state => state.fetchCart);
    const getTotalPrice = useCartStore(state => state.getTotalPrice);
    const clearCart = useCartStore(state => state.clearCart);

    // Address states
    const [paymentMethod, setPaymentMethod] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    // Fetch cart on mount
    useEffect(() => {
      fetchCart();
    }, []);

    // Fetch provinces on mount
    useEffect(() => {
      fetch("https://provinces.open-api.vn/api/p/")
        .then(res => res.json())
        .then(data => setProvinces(data));
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
      if (!selectedProvince) return;

      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts));
    }, [selectedProvince]);

    // Fetch wards when district changes
    useEffect(() => {
      if (!selectedDistrict) return;

      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards));
    }, [selectedDistrict]);

    // Handle order
 const handleOrder = async () => {
  if (
    !selectedProvince ||
    !selectedDistrict ||
    !selectedWard ||
    !detailAddress ||
    !paymentMethod
  ) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  const provinceName = provinces.find(p => p.code == selectedProvince)?.name;
  const districtName = districts.find(d => d.code == selectedDistrict)?.name;
  const wardName = wards.find(w => w.code == selectedWard)?.name;

  const fullAddress = `${detailAddress}, ${wardName}, ${districtName}, ${provinceName}`;

  const orderPayload = {
    shippingAddress: fullAddress,
    paymentMethod,
    totalPrice: getTotalPrice(),
    items: cartItems.map(item => ({
      productName: item.productName,
      quantity: item.quantity,
      price: item.price
    }))
  };

  try {
    const res = await orderApi.createOrder(orderPayload);
console.log("Order created:", res.data.checkoutUrl);
    // 👉 PAYOS
    if (res.data.checkoutUrl) {
      window.location.href = res.data.checkoutUrl;
      return;
    }

    // 👉 COD
    clearCart();
    navigate("/order");

  } catch (err) {
    console.error(err);
    alert("Đặt hàng thất bại");
  }
};




    return (
      <div className="checkout-container">
        <h2>Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Không có sản phẩm trong giỏ hàng</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map(item => (
              <li className="cart-item" key={item.productId}>
                <span className="cart-item-name">
                  {item.productName} × {item.quantity}
                </span>
                <span className="cart-item-price">
                  {item.price.toLocaleString()} đ
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="total">
          Tổng tiền: {getTotalPrice().toLocaleString()} đ
        </div>

        {/* ADDRESS SELECTS */}
        <div className="address-group">
          <select
            className="address-select"
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setDistricts([]);
              setWards([]);
              setSelectedDistrict("");
              setSelectedWard("");
            }}
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>

          <select
            className="address-select"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setWards([]);
              setSelectedWard("");
            }}
            disabled={!districts.length}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>

          <select
            className="address-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!wards.length}
          >
            <option value="">-- Chọn Xã/Phường --</option>
            {wards.map(w => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>

          <input
            type="text"
            className="address-input"
            placeholder="Số nhà, tên đường..."
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />
        </div>
  <div className="payment-group">
    <h4>Phương thức thanh toán</h4>

    <label>
      <input
        type="radio"
        name="payment"
        value="COD"
        checked={paymentMethod === "COD"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Thanh toán khi nhận hàng (COD)
    </label>

    <label>
      <input
        type="radio"
        name="payment"
        value="BANKING"
        checked={paymentMethod === "BANKING"}
        onChange={(e) => setPaymentMethod(e.target.value)}
      />
      Chuyển khoản ngân hàng
    </label>
  </div>
        <button className="order-btn" onClick={handleOrder}>
          Đặt hàng
        </button>
      </div>
    );
  }
