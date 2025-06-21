import React, { useEffect, useState } from 'react'
import './Orders.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {

  const [orders, setOrders] = useState([]);
  const [hideDelivered, setHideDelivered] = useState(true); // Чекбокс активирован по умолчанию

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`)
    if (response.data.success) {
      setOrders(response.data.data.reverse());
    }
    else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    console.log(event, orderId);
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }


  useEffect(() => {
    fetchAllOrders();
  }, [])

  const filteredOrders = hideDelivered
    ? orders.filter(order => order.status !== "Доставлено")
    : orders;

  return (
    <div className='order add'>
      <div className="order-header">
        <p>Страница заказов</p>
        <label className="hide-delivered-label">
          <span>Скрыть доставленные</span>
          <input
            type="checkbox"
            checked={hideDelivered}
            onChange={e => setHideDelivered(e.target.checked)}
            className={hideDelivered ? "checked" : ""}
          />
        </label>
      </div>
      
      <div className="order-list-wrapper">
        <div className="order-list">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className={`order-item${order.status === "Доставлено" ? " delivered" : ""}`}
            >
              <img className="order-item-icon" src={assets.parcel_icon} alt="" />
              <div className="order-item-details">
                <p className='order-item-food'>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity
                    }
                    else {
                      return item.name + " x " + item.quantity + ", "
                    }
                  })}
                </p>
                <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                <div className='order-item-address'>
                  <p>{order.address.city}</p>
                  <p>{order.address.street}</p> 
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              {/* Вместо количества выводим дату заказа */}
              <p className="order-item-date">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Нет даты'}
              </p>
              <p className="order-item-amount">{currency}{order.amount}</p>
              <select
                className="order-item-status"
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
                name=""
                id=""
              >
                <option value="Приготовление">Приготовление</option>
                <option value="Доставляется">Доставляется</option>
                <option value="Доставлено">Доставлено</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Order
