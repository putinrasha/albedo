import React, { useContext, useState } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import './UserSettings.css'

/*
API методы:

POST /api/user/update-name
  - Описание: Обновляет имя пользователя.
  - Тело запроса: { name: string }
  - Заголовки: { token: string }
  - Ответ: { success: boolean, message?: string }

POST /api/user/update-password
  - Описание: Меняет пароль пользователя.
  - Тело запроса: { password: string, newPassword: string }
  - Заголовки: { token: string }
  - Ответ: { success: boolean, message?: string }
*/

const UserSettings = () => {
  const { token, url } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentName, setCurrentName] = useState('')

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        // Используем getUserById (GET-запрос с query-параметром id)
        const res = await axios.get(
          url + '/api/user/getuser',
          { params: { id: token ? JSON.parse(atob(token.split('.')[1])).id : undefined } }
        );
        if (res.data.success && res.data.user?.name) {
          setCurrentName(res.data.user.name);
        }
      } catch {
        // ignore error
      }
    }
    fetchUser()
  }, [token, url])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Отправляем все значения одним запросом
      const res = await axios.post(
        url + '/api/user/update',
        {
          name: name.trim() ? name : undefined,
          password: password || undefined,
          newPassword: newPassword || undefined
        },
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success(res.data.message || 'Данные успешно обновлены')
        if (name.trim()) setName('')
        setPassword('')
        setNewPassword('')
      } else {
        toast.error(res.data.message)
      }
    } catch {
      toast.error('Ошибка при обновлении данных')
    }
    setLoading(false)
  }

  return (
    <div className="user-settings" style={{margin: '100px auto', maxWidth: 400}}>
      <h2>Настройки пользователя</h2>
      <form onSubmit={handleSubmit}>
        <label>Новое имя:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={currentName}
        />
        <label>Новый пароль:</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <label>Старый пароль:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Сохранить изменения</button>
      </form>
    </div>
  )
}

export default UserSettings