import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Добавить в меню</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Список меню</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Заказы</p>
        </NavLink>
        <NavLink to='/users' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Пользователи</p>
        </NavLink>
        <NavLink to='/stats' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Статистика</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
