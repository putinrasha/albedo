import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Этот сайт был создан для дипломной работы студентом группы 4ПОВТ-17Б Качко Романом. Сайт создан с использованием React и NodeJS. Функционал представляет собой возможность регистрации и аавторизации, оформление заказов и оплата через кассу, просмотр состояния заказа, а также взаимодействие с помощью админской панельки. Йоу</p>
        </div>
        <div className="footer-content-center">
            <h2>Ссылки</h2>
            <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a></li>
            <li><a href="https://nodejs.org/en" target="_blank" rel="noopener noreferrer">Node JS</a></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Свяжитесь с нами</h2>
            <ul>
                <li>+7-777-77-77-777</li>
                <li>contacust@diplom.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Made by Kachko Roman for diplomchik. With love❤️❤️❤️</p>
    </div>
  )
}

export default Footer
