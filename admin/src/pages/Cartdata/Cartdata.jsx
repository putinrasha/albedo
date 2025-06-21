import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cartdata.css";

const Cartdata = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [orders, setOrders] = useState({});
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Получаем список всех товаров
  const fetchFoods = async () => {
    try {
      const res = await axios.get(url + "/api/food/list");
      if (res.data.success && Array.isArray(res.data.data)) {
        setFoods(res.data.data);
      } else {
        setFoods([]);
        toast.error("Ошибка при получении товаров");
      }
    } catch {
      setFoods([]);
      toast.error("Ошибка при получении товаров");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          url + "/api/cart/usercartdata",
          { userId },
          { headers: { token } }
        );
        const cart = res.data.orders || res.data.cartData || {};
        if (res.data.success && typeof cart === "object" && cart !== null) {
          setOrders(cart);
        } else {
          setOrders({});
          toast.error(res.data.message || "Ошибка при получении заказов");
        }
      } catch (err) {
        setOrders({});
        toast.error("Ошибка при получении заказов");
        console.error("Ошибка при запросе заказов:", err);
      }
      setLoading(false);
    };
    if (userId) fetchOrders();
  }, [userId]);

  // Получить данные о товаре по id
  const getFoodById = (id) => foods.find(f => f._id === id);

  // Считаем итоговую сумму
  const totalSum = Object.entries(orders).reduce((acc, [itemId, count]) => {
    const food = getFoodById(itemId);
    if (food) {
      return acc + food.price * count;
    }
    return acc;
  }, 0);

  return (
    <div className='list add flex-col'>
            <a
          className='back'
          href="http://localhost:5174/users"
      >
          Назад
      </a>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p>Страница заказов</p>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!loading && Object.keys(orders).length > 0 && (
        <div style={{textAlign: "right"}}>
          Итого: {totalSum}₸
        </div>
      )}
        </label>
      </div>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>ID</b>
          <b>Название</b>
          <b>Количество</b>
          <b>Цена</b>
          <b>Сумма</b>
        </div>
        {loading ? (
          <div className="list-table-format">
            <p style={{ gridColumn: "1 / span 5", textAlign: "center" }}>Загрузка...</p>
          </div>
        ) : Object.keys(orders).length === 0 ? (
          <div className="list-table-format">
            <p style={{ gridColumn: "1 / span 5", textAlign: "center" }}>Корзина пуста</p>
          </div>
        ) : (() => {
          // Фильтруем только строки с количеством > 0
          const filtered = Object.entries(orders).filter(([itemId, count]) => count > 0);
          if (filtered.length === 0) {
            return (
              <div className="list-table-format">
                <p style={{ gridColumn: "1 / span 5", textAlign: "center" }}>Корзина пуста</p>
              </div>
            );
          }
          return (
            <>
              {filtered.map(([itemId, count]) => {
                const food = getFoodById(itemId);
                const price = food ? food.price : "-";
                const name = food ? food.name : "Не найдено";
                const sum = food ? food.price * count : "-";
                return (
                  <div key={itemId} className='list-table-format'>
                    <p>{itemId}</p>
                    <p>{name}</p>
                    <p>{count}</p>
                    <p>{price}</p>
                    <p>{sum}</p>
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Cartdata;
