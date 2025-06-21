import mongoose from "mongoose";

export const  connectDB = async () =>{

    await mongoose.connect('mongodb+srv://zopadz:r05k072005@cluster0.r7dpl.mongodb.net/food-del').then(()=>console.log("DB Connected"));
   
}
