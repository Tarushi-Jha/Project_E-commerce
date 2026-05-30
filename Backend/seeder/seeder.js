import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/college_cart");

    await Product.deleteMany();
    console.log("Products are deleted");

    // Create or find a seeder admin user
    let adminUser = await User.findOne({ email: "admin@shopit.com" });

    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin",
        email: "admin@shopit.com",
        password: "123456",
        role: "admin",
      });
      console.log("Admin user created");
    }

    // Add user field to all products
    const productsWithUser = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    await Product.insertMany(productsWithUser);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
