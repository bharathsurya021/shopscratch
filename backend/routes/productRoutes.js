import express from 'express'
import { getProductById, getProducts, deleteProduct, updateProduct, createProduct, createProductReview } from '../controllers/productController.js'
import { protect, checkIsAdmin } from '../middleware/authMiddleware.js'
const router = express.Router()



router.route('/').get(getProducts).post(protect, checkIsAdmin, createProduct)


router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id').get(getProductById).delete(protect, checkIsAdmin, deleteProduct).put(protect, checkIsAdmin, updateProduct)

export default router