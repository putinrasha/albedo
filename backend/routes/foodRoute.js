import express from 'express';
import { addFood, listFood, removeFood, editFood, getFoodById } from '../controllers/foodController.js';
import multer from 'multer';
const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.post("/remove", removeFood);
// Заменяем post на put для обновления (edit)
foodRouter.put("/:id", upload.single('image'), editFood);
foodRouter.get("/get", getFoodById);

export default foodRouter;