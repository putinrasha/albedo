import React from 'react'
import './Header.css'
import { StoreContext } from '../../Context/StoreContext'

const Header = () => {
    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Закажите еду у нас</h2>
                <p>Выбирайте из разнообразного меню блюда, приготовленные из лучших ингредиентов и кулинарного мастерства. Наша миссия состоит в том, чтобы удовлетворить вашу тягу к еде и улучшить ваши впечатления от еды.</p>
                <button onClick={() => {document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" });}}>Наше меню</button>
            </div>
        </div>
    )
}

export default Header
