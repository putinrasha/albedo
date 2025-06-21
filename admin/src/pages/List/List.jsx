import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {

  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  // Получаем уникальные категории из списка
  const categories = Array.from(new Set(list.map(item => item.category))).filter(Boolean);

  return (
    <div className='list add flex-col'>
      <div className="list-header-row">
        <p className="list-header-title">Весь список меню</p>
        <div className="list-header-search-wrapper">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="list-header-search-input"
          />
        </div>
        <div className="list-header-category-wrapper">
          <select
            className="list-header-category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            {categories.map(cat =>
              <option key={cat} value={cat}>{cat}</option>
            )}
          </select>
        </div>
      </div>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Фотография</b>
          <b>Название</b>
          <b>Категория</b>
          <b>Цена</b>
          <b>Изменить</b>
        </div>
        {list
          .filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === 'all' || item.category === category)
          )
          .map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` + item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
                <p className='cursor' onClick={() => window.location.href = `/changelist?id=${item._id}`}>Изменить</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default List
