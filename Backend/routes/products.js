import express from "express";
import {
  getProducts,
  newProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct)
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.route("/products/:id").get(getProductDetails);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

export default router;
