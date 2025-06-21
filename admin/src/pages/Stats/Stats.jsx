import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Stats.css'
import { url, currency } from '../../assets/assets'
import * as XLSX from 'xlsx'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Функция для генерации случайного цвета
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Stats = () => {
  const [orders, setOrders] = useState([]);
  const [foodMap, setFoodMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  // Получаем список всех товаров для отображения названий
  useEffect(() => {
    axios.get(`${url}/api/food/list`).then(res => {
      if (res.data.success) {
        const map = {};
        res.data.data.forEach(f => { map[f._id] = f; });
        setFoodMap(map);
      }
    });
  }, []);

  // Получаем все заказы
  useEffect(() => {
    setLoading(true);
    axios.get(`${url}/api/order/list`).then(res => {
      if (res.data.success) {
        setOrders(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  // Фильтруем заказы по выбранной дате
  const todayOrders = orders.filter(order =>
    order.createdAt && order.createdAt.slice(0, 10) === selectedDate
  );

  // Сумма и количество продаж за день
  const totalAmount = todayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalCount = todayOrders.length;

  // Считаем сколько каких товаров купили
  const productStats = {};
  todayOrders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!productStats[item._id]) {
        productStats[item._id] = { count: 0 };
      }
      productStats[item._id].count += item.quantity;
    });
  });

  // Массив для рендера таблицы
  const statsArray = Object.entries(productStats).map(([id, stat]) => {
    const food = foodMap[id];
    return {
      id,
      image: food?.image,
      name: food?.name || id,
      category: food?.category || '',
      count: stat.count,
      price: food?.price || 0,
      total: food ? food.price * stat.count : 0
    }
  });

  const exportToExcel = () => {
    // Создаем массив данных начиная с A1
    const exportData = [
      ['Общая статистика'],
      ['Общая сумма продаж:', totalAmount],
      ['Количество продаж:', totalCount],
      [], // пустая строка для разделения
      ['Название', 'Категория', 'Количество', 'Цена', 'Сумма'], // Заголовки таблицы
    ];

    // Добавляем данные товаров
    statsArray.forEach(row => {
      exportData.push([
        row.name,
        row.category,
        row.count,
        row.price,
        row.total
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    const colWidths = [
      { wch: 30 }, // Название
      { wch: 15 }, // Категория
      { wch: 12 }, // Количество
      { wch: 12 }, // Цена
      { wch: 12 }, // Сумма
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Статистика");
    XLSX.writeFile(wb, `Статистика ${selectedDate}.xlsx`);
  };

  // Генерируем массив случайных цветов для каждого товара
  const backgroundColors = statsArray.map(() => {
    const color = getRandomColor();
    return {
      backgroundColor: `${color}80`, // добавляем прозрачность
      borderColor: color,
    }
  });

  // Обновленные данные для графика
  const chartData = {
    labels: statsArray.map(item => item.name),
    datasets: [
      {
        label: 'Сумма продаж',
        data: statsArray.map(item => item.total),
        backgroundColor: backgroundColors.map(color => color.backgroundColor),
        borderColor: backgroundColors.map(color => color.borderColor),
        borderWidth: 1
      }
    ]
  }

  // Обновленные опции графика для Chart.js 4
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Сумма продаж по товарам',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return currency + value;
          }
        }
      }
    }
  }

  return (
    <div className="stats add" style={{ margin: "60px 95px" }}>
      {/* Блок с датой и кнопкой экспорта */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 400, margin: 0 }}>Статистика</p>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{
              fontSize: 15,
              padding: "6px 12px",
              border: "1px solid #cacaca",
              borderRadius: 4,
              minWidth: 140
            }}
          />
          <button
            onClick={exportToExcel}
            style={{
              padding: "6px 12px",
              backgroundColor: "#FF6347",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Экспорт в Excel
          </button>
        </div>
      </div>

      {/* Блок с общей статистикой и графиком */}
      <div style={{ 
        display: "flex", 
        gap: "40px",
        marginBottom: 40
      }}>
        {/* Блок статистики */}
        <div style={{ 
          fontSize: 24, 
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px"
        }}>
          <div><b>Сумма продаж:</b> {currency}{totalAmount}</div>
          <div><b>Количество продаж:</b> {totalCount}</div>
        </div>

        {/* График */}
        <div style={{ 
          flex: 1,
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "400px",
          maxWidth: "900px",
           marginLeft: "auto"
        }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Блок с таблицей */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 400, margin: "25px 0" }}>Купленные товары</h3>
        <div className="stats-table">
          <div className="stats-table-format title">
            <b>Фотография</b>
            <b>Название</b>
            <b>Категория</b>
            <b>Количество</b>
            <b>Цена</b>
            <b>Сумма</b>
          </div>
          {loading ? (
            <div className="stats-table-format">
              <p style={{ gridColumn: "1 / span 6", textAlign: "center" }}>Загрузка...</p>
            </div>
          ) : statsArray.length === 0 ? (
            <div className="stats-table-format">
              <p style={{ gridColumn: "1 / span 6", textAlign: "center" }}>Нет продаж за сегодня</p>
            </div>
          ) : (
            statsArray.map((row, idx) => (
              <div key={row.id} className="stats-table-format">
                <img src={row.image ? `${url}/images/${row.image}` : ''} alt="" className="stats-table-img" />
                <p>{row.name}</p>
                <p>{row.category}</p>
                <p>{row.count}</p>
                <p>{currency}{row.price}</p>
                <p>{currency}{row.total}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Stats
