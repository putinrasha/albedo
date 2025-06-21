import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, addToCart, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Предмет</p> <p>Название</p> <p>Цена</p> <p>Количество</p> <p>Итого</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>{currency}{item.price}</p>
                <div className="cart-quantity-controls">
                  <span className="cart-items-remove-icon" onClick={() => removeFromCart(item._id)}>-</span>
                  <span>{cartItems[item._id]}</span>
                  <span className="cart-items-add-icon" onClick={() => addToCart(item._id)}>+</span>
                </div>
                <p>{currency}{item.price*cartItems[item._id]}</p>
              </div>
              <hr />
            </div>)
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>К оформлению</h2>
          <div>
            <div className="cart-total-details"><p>Цена</p><p>{currency}{getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Доставка</p><p>{currency}{getTotalCartAmount()===0?0:deliveryCharge}</p></div>
            <hr />
            <div className="cart-total-details"><b>Итого</b><b>{currency}{getTotalCartAmount()===0?0:getTotalCartAmount()+deliveryCharge}</b></div>
          </div>
          <button onClick={()=>navigate('/order')}>Продолжить оплату</button>
        </div>
      </div>
    </div>
  )
}

export default Cart
