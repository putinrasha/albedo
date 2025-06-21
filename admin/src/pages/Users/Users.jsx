import React, { useEffect, useState } from 'react'
import { url } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [onlyAdmins, setOnlyAdmins] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/all`);
      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        toast.error("Ошибка при получении пользователей");
      }
    } catch {
      setUsers([]);
      toast.error("Ошибка при получении пользователей");
    }
  }

  // Функция для обновления статуса isAdmin
const handleAdminToggle = async (userId, currentIsAdmin) => {

  const user = users.find(u => u._id === userId);
  if (user && user.email === "admin@gmail.com") {
    toast.error("Нельзя изменить права этого пользователя");
    return;
  }
  try {
    const response = await axios.post(`${url}/api/user/updateadmin`, {
      userId,
      isAdmin: currentIsAdmin === 1 ? 0 : 1,
    });
    if (response.data.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isAdmin: currentIsAdmin === 1 ? 0 : 1 } : u
        )
      );
      toast.success("Статус администратора обновлен");
    } else {
      toast.error(response.data.message || "Ошибка при обновлении статуса");
    }
  } catch {
    toast.error("Ошибка при обновлении статуса");
  }
};

  useEffect(() => {
    fetchUsers();
  }, [])

  // Фильтрация по имени, почте и чекбоксу "Только админы"
  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())) &&
    (!onlyAdmins || user.isAdmin === 1)
  );

  return (
    <div className='list add flex-col'>
      <div className="users-header-row">
        <p className="users-header-title">Все пользователи</p>
        <div className="users-header-search-wrapper">
          <input
            type="text"
            placeholder="Поиск по имени или почте..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="users-header-search-input"
          />
        </div>
        <div className="users-header-admin-checkbox-wrapper">
          <label className="users-header-admin-checkbox-label">
            Только админы
            <input
              type="checkbox"
              checked={onlyAdmins}
              onChange={e => setOnlyAdmins(e.target.checked)}
              className="users-header-admin-checkbox"
            />
          </label>
        </div>
      </div>
      <div className='list-table'>
        <div
          className="list-table-format title"
          style={{gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 0.7fr",}}
        >
          <b>ID</b>
          <b>Имя</b>
          <b>Почта</b>
          <b>Корзина</b>
          <b>Заказы</b>
          <b>Админ</b>
        </div>
        {filteredUsers.map((user, index) => (
          <div key={user._id || index} className="list-table-format"
          style={{gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 0.7fr",}}>
            <p>{user._id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>
              <span
                className="button-link"
                onClick={() => window.location.href = `/usercartdata?userId=${user._id}`}
              >
                Показать
              </span>
            </p>
            <p>
              <span
                className="button-link"
                onClick={() => window.location.href = `/userorderdata?userId=${user._id}`}
              >
                Показать
              </span>
            </p>
            <p>
              {/* Toggle Switch */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.isAdmin === 1}
                  onChange={() => handleAdminToggle(user._id, user.isAdmin)}
                />
                <span className="slider round"></span>
              </label>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users