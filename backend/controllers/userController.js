import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)

        res.json({success:true,token, isAdmin: user.isAdmin})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            isAdmin: 0,
            signUpDate: new Date()
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const updateUser = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.json({ success: false, message: "Нет токена" });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.json({ success: false, message: "Неверный токен" });
        }

        const { name, password, newPassword } = req.body;
        if (!password) {
            return res.json({ success: false, message: "Введите старый пароль" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Неверный старый пароль" });
        }

        let updatedFields = {};
        if (name && name !== user.name) {
            updatedFields.name = name;
        }
        if (newPassword) {
            if (newPassword.length < 8) {
                return res.json({ success: false, message: "Пароль должен быть не менее 8 символов" });
            }
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(newPassword, salt);
        }

        if (Object.keys(updatedFields).length === 0) {
            return res.json({ success: false, message: "Нет изменений для сохранения" });
        }

        await userModel.findByIdAndUpdate(userId, updatedFields, { new: true });

        return res.json({ success: true, message: "Данные успешно обновлены" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Ошибка при обновлении данных" });
    }
}
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, " _id name email cartData isAdmin");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, users: [] });
  }
};

const updateUserAdminStatus = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    if (typeof isAdmin !== "number" || (isAdmin !== 0 && isAdmin !== 1)) {
      return res.json({ success: false, message: "Некорректное значение isAdmin" });
    }
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );
    if (!user) {
      return res.json({ success: false, message: "Пользователь не найден" });
    }
    res.json({ success: true, message: "Статус администратора обновлен", isAdmin: user.isAdmin });
  } catch (error) {
    res.json({ success: false, message: "Ошибка при обновлении статуса администратора" });
  }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.json({ success: false, message: "Не передан id пользователя" });
        }
        const user = await userModel.findById(id);
        if (!user) {
            return res.json({ success: false, message: "Пользователь не найден" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Ошибка при получении пользователя" });
    }
}

export { loginUser, registerUser, updateUser, getAllUsers, updateUserAdminStatus, getUserById }
