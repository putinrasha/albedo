import React, { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url,loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Зарегистрироваться");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Войти") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        const response = await axios.post(new_url, data);
        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token)
            loadCartData({token:response.data.token})
            setShowLogin(false)

            if (typeof response.data.isAdmin !== "undefined") {
                if (response.data.isAdmin === 1) {
                    window.location.href = "http://localhost:5174/";
                } else {
                    window.location.href = "https://delivery-frontend-qm84.onrender.com";
                }
            }
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Зарегистрироваться" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Имя' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Пароль' required />
                </div>
                <button>{currState === "Войти" ? "Войти" : "Создать аккаунт"}</button>
                {currState === "Войти"
                    ? <p>Нет аккаунта? <span onClick={() => setCurrState('Зарегистрироваться')}>Создать</span></p>
                    : <p>Уже есть аккаунт? <span onClick={() => setCurrState('Войти')}>Войти</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
