const express = require('express');
const router = express.Router();

const {
    getProducts, 
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReview,
    deleteReview
} = require('../controller/productController');

const{isAuthenticatedUser,authorizeRoles} = require('../middlewares/auth')

router.route('/products').get(getProducts);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/:id')
                .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
                .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteProduct);

//router.route('/admin/product/:id').put(updateProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview)
                        .get(isAuthenticatedUser, getProductReview)
                        .delete(isAuthenticatedUser,deleteReview)

module.exports = router;