import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, currency } from "../../assets/assets";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Userorder = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          url + "/api/order/userorderdata",
          { userId },
          { headers: { token } }
        );
        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setOrders([]);
          toast.error(res.data.message || "Ошибка при получении заказов пользователя");
        }
      } catch (err) {
        setOrders([]);
        toast.error("Ошибка при получении заказов пользователя");
        console.error("Ошибка при запросе заказов пользователя:", err);
      }
      setLoading(false);
    };
    if (userId) fetchUserOrders();
  }, [userId]);

  return (
    <div className="list add flex-col">
      <a
          className='back'
          href="http://localhost:5174/users"
      >
          Назад
      </a>
      <p>Заказы пользователя</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Дата</b>
          <b>ID заказа</b>
          <b>Состав</b>
          <b>Сумма</b>
          <b>Статус</b>
        </div>
        {loading ? (
          <div className="list-table-format">
            <p style={{ gridColumn: "1 / span 5", textAlign: "center" }}>Загрузка...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="list-table-format">
            <p style={{ gridColumn: "1 / span 5", textAlign: "center" }}>Нет заказов</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="list-table-format">
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "-"}
              </p>
              <p>{order._id}</p>
              <p>
                {order.items && order.items.map((item, idx) =>
                  <span key={idx}>
                    {item.name} x {item.quantity}{idx < order.items.length - 1 ? ", " : ""}
                  </span>
                )}
              </p>
              <p>{currency}{order.amount}</p>
              <p
                style={{
                  color: order.status === "Доставлено" ? "#57F057" : "#ff6347",
                  fontWeight: 600
                }}
              >
                {order.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Userorder;
