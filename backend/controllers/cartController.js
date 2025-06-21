import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
   try {
      let userData = await userModel.findOne({_id:req.body.userId});
      let cartData = await userData.cartData;
      if (!cartData[req.body.itemId]) {
         cartData[req.body.itemId] = 1;
      }
      else {
         cartData[req.body.itemId] += 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      if (cartData[req.body.itemId] > 0) {
         cartData[req.body.itemId] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// Получить корзину пользователя по его _id (userId)
const getUserOrders = async (req, res) => {
   try {
      const { userId } = req.body;
      if (!userId) {
         return res.json({ success: false, message: "userId обязателен" });
      }
      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "Пользователь не найден" });
      }
      // Здесь cartData — это объект с заказами (товарами и их количеством)
      res.json({ success: true, orders: user.cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Ошибка при получении заказов пользователя" });
   }
}

const updateCartItemQuantity = async (req, res) => {
   try {
      const { userId, itemId, quantity } = req.body;

      if (!userId || !itemId || typeof quantity !== 'number') {
         return res.json({ success: false, message: "userId, itemId и quantity обязательны" });
      }

      const user = await userModel.findById(userId);
      if (!user) {
         return res.json({ success: false, message: "Пользователь не найден" });
      }

      const cartData = user.cartData || {};

      if (quantity <= 0) {
         delete cartData[itemId]; // Удаляем товар, если количество 0
      } else {
         cartData[itemId] = quantity;
      }

      await userModel.findByIdAndUpdate(userId, { cartData });

      res.json({ success: true, message: "Количество обновлено" });
   } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
   }
};


export { addToCart, removeFromCart, getCart, getUserOrders, updateCartItemQuantity }