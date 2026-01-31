import { useEffect, useState } from "react";
import { useCartStore } from "../store/cartStore";
import { orderApi } from "../api/orderApi";
import "./Checkout.css";

export default function Checkout() {
  // Cart store
  const cartItems = useCartStore(state => state.cartItems);
  const fetchCart = useCartStore(state => state.fetchCart);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);
  const clearCart = useCartStore(state => state.clearCart);

  // Address states
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
    if (!selectedProvince || !selectedDistrict || !selectedWard || !detailAddress) {
      alert("Vui lòng nhập đầy đủ địa chỉ giao hàng");
      return;
    }

    const provinceName = provinces.find(p => p.code == selectedProvince)?.name;
    const districtName = districts.find(d => d.code == selectedDistrict)?.name;
    const wardName = wards.find(w => w.code == selectedWard)?.name;

    const fullAddress = `${detailAddress}, ${wardName}, ${districtName}, ${provinceName}`;

    try {
      const res = await orderApi.createOrder({
        shippingAddress: fullAddress,
        items: cartItems.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      });

      alert("Đặt hàng thành công!");
      clearCart();
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

      <button className="order-btn" onClick={handleOrder}>
        Đặt hàng
      </button>
    </div>
  );
}
