import foodModel from "../models/foodModel.js";
import fs from 'fs'

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food && food.image) {
            fs.unlink(`uploads/${food.image}`, () => { });
        }
        await foodModel.findByIdAndDelete(req.body.id);

        // Удаляем этот товар из всех корзин пользователей
        const userModel = (await import("../models/userModel.js")).default;
        await userModel.updateMany(
            {},
            { $unset: { [`cartData.${req.body.id}`]: "" } }
        );

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// edit food
const editFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // Update fields
        food.name = req.body.name || food.name;
        food.description = req.body.description || food.description;
        food.price = req.body.price || food.price;
        food.category = req.body.category || food.category;

        // If new image uploaded
        if (req.file) {
            // Remove old image
            if (food.image) {
                fs.unlink(`uploads/${food.image}`, () => {});
            }
            food.image = req.file.filename;
        }

        await food.save();
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// get food by id (GET-запрос, req.query.id)
const getFoodById = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.json({ success: false, message: "No id provided" });
        }
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({ success: false, message: "Invalid id format" });
        }
        const food = await foodModel.findById(id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// В foodModel уже прописано, что коллекция называется foods, если в схеме указано { collection: 'foods' } или модель названа foodModel (mongoose сам преобразует в foods).
// Если вдруг коллекция не совпадает, можно явно указать коллекцию при создании модели, но в контроллере ничего менять не нужно.
// Всё остальное работает корректно с коллекцией foods, если модель foodModel настроена правильно.

export { listFood, addFood, removeFood, editFood, getFoodById }