import React, { useState, useEffect } from 'react'
import { assets, url } from '../../assets/assets';
import './Changelist.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Edit = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [food, setFood] = useState(null);
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Салат"
    });

    useEffect(() => {
        if (id) {
            axios.get(`${url}/api/food/get?id=${id}`)
                .then(res => {
                    if (res.data && res.data.success && res.data.data) {
                        setFood(res.data.data);
                        setData({
                            name: res.data.data.name || "",
                            description: res.data.data.description || "",
                            price: res.data.data.price || "",
                            category: res.data.data.category || "Салат"
                        });
                        setImage(false);
                    } else {
                        setFood(null);
                        setData({
                            name: "",
                            description: "",
                            price: "",
                            category: "Салат"
                        });
                        setImage(false);
                        console.log('getFoodById: нет данных', res.data);
                    }
                })
                .catch(err => {
                    setFood(null);
                    setData({
                        name: "",
                        description: "",
                        price: "",
                        category: "Салат"
                    });
                    setImage(false);
                    console.log('getFoodById error:', err);
                });
        } else {
            setFood(null);
            setData({
                name: "",
                description: "",
                price: "",
                category: "Салат"
            });
            setImage(false);
        }
    }, [id]);

      const removeFood = async (foodId) => {
        const response = await axios.post(`${url}/api/food/remove`, {
            id: foodId
        });
        if (response.data.success) {
            toast.success(response.data.message);
            window.location.href = "http://localhost:5174/list";
        } else {
            toast.error("Error");
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        // Добавляем изображение только если оно выбрано
        if (image) {
            formData.append("image", image);
        }

        try {
            // Для обновления используем editFood (PUT-запрос)
            const response = await axios.put(`${url}/api/food/${food?._id || id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                // Можно обновить состояние или сделать редирект
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Ошибка при обновлении");
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    return (
        <div>
            {/* Форма добавления/редактирования */}
            <div className='add'>
                <form className='flex-col' onSubmit={onSubmitHandler}>
                    {/* Кнопка "Назад" внутри формы, перед всем остальным */}
                    <a
                        className='back'
                        href="http://localhost:5174/list"
                    >
                        Назад
                    </a>
                    <div className='add-img-upload flex-col'>
                        <p>Загрузить фотографию</p>
                        <input
                            onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }}
                            type="file"
                            accept="image/*"
                            id="image"
                            hidden
                        />
                        <label htmlFor="image">
                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : (food && food.image
                                            ? `${url}/images/${food.image}`
                                            : assets.upload_area)
                                }
                                alt=""
                            />
                        </label>
                    </div>
                    <div className='add-product-name flex-col'>
                        <p>Название</p>
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='' required />
                    </div>
                    <div className='add-product-description flex-col'>
                        <p>Описание</p>
                        <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='' required />
                    </div>
                    <div className='add-category-price'>
                        <div className='add-category flex-col'>
                            <p>Категория</p>
                            <select name='category' onChange={onChangeHandler} value={data.category}>
                                <option value="Салаты">Салат</option>
                                <option value="Роллы">Роллы</option>
                                <option value="Десерты">Десерт</option>
                                <option value="Сендвичи">Сендвич</option>
                                <option value="Тортики">Тортик</option>
                                <option value="На пару">На пару</option>
                                <option value="Паста">Паста</option>
                                <option value="Напитки">Напитки</option>
                            </select>
                        </div>
                        <div className='add-price flex-col'>
                            <p>Цена</p>
                            <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='25' />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type='submit' className='add-btn'>Изменить</button>
                        <button
                            type='button'
                            className='add-btn'
                            style={{ background: '#e74c3c' }}
                            onClick={() => food && removeFood(food._id)}
                        >
                            Удалить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Edit;

