const handlers = require('../controllers')
const multer = require('multer')
const auth = require('./auth')

let upload = multer({ dest: './content/images' })

module.exports = (app) => {
    app.get('/', handlers.home.index)

    app.get('/product/add', auth.isAuthenticated, handlers.product.addGet)
    app.post('/product/add', auth.isAuthenticated, upload.single('image'), handlers.product.addPost)

    app.get('/cause/add', auth.isInRole('Admin'), handlers.cause.addGet)
    app.post('/cause/add', auth.isInRole('Admin'), upload.single('image'), handlers.cause.addPost)
    app.get('/cause/all', handlers.cause.getAllCauses)
    app.get('/cause/completed', handlers.cause.getCompletedCauses)
    app.get('/cause/delete/:id', auth.isInRole('Admin'), handlers.cause.deleteGet)
    app.post('/cause/delete/:id', auth.isInRole('Admin'), handlers.cause.deletePost)
    app.get('/cause/edit/:id', auth.isInRole('Admin'), handlers.cause.editGet)
    app.post('/cause/edit/:id', upload.single('image'), auth.isInRole('Admin'), handlers.cause.editPost)
    app.get('/cause/donate/:id', handlers.cause.viewProducts)

    app.get('/event/add', auth.isInRole('Admin'), handlers.event.addGet)
    app.post('/event/add', auth.isInRole('Admin'), upload.single('image'), handlers.event.addPost)
    app.get('/event/edit/:id', auth.isInRole('Admin'), handlers.event.editGet)
    app.post('/event/edit/:id', auth.isInRole('Admin'), upload.single('image'), handlers.event.editPost)
    app.get('/event/delete/:id', auth.isInRole('Admin'), handlers.event.deleteGet)
    app.post('/event/delete/:id', auth.isInRole('Admin'), handlers.event.deletePost)
    app.get('/event/details/:id', handlers.event.getDetails)
    app.get('/event/all', handlers.event.getAllEvents)
    app.get('/event/register/:id', auth.isAuthenticated, handlers.event.registerForEvent)
    app.get('/event/unregister/:id', auth.isAuthenticated, handlers.event.unregisterFromEvent)

    app.get('/category/add', auth.isInRole('Admin'), handlers.category.addGet)
    app.post('/category/add', auth.isInRole('Admin'), handlers.category.addPost)
    app.get('/category/all', auth.isInRole('Admin'), handlers.category.getAllCategories)

    app.get('/category/edit/:id', auth.isInRole('Admin'), handlers.category.editGet)
    app.post('/category/edit/:id', auth.isInRole('Admin'), handlers.category.editPost)


    app.get('/category/:category/products', handlers.category.productsByCategory)
    app.get('/products', handlers.product.getAllProducts)

    app.get('/product/edit/:id', auth.isAuthenticated, handlers.product.editGet)
    app.post('/product/edit/:id', auth.isAuthenticated, upload.single('image'), handlers.product.editPost)

    app.get('/product/delete/:id', auth.isAuthenticated, handlers.product.deleteGet)
    app.post('/product/delete/:id', auth.isAuthenticated, handlers.product.deletePost)

    app.get('/product/details/:id', handlers.product.getProductDetails)
    app.get('/product/buy/:id', auth.isAuthenticated, handlers.product.buyGet)
    app.post('/product/buy/:id', auth.isAuthenticated, handlers.product.buyPost)

    app.get('/user/register', handlers.user.registerGet)
    app.post('/user/register', handlers.user.registerPost)

    app.get('/user/login', handlers.user.loginGet)
    app.post('/user/login', handlers.user.loginPost)

    app.post('/user/logout', handlers.user.logout)

    app.get('/user/myProducts', auth.isAuthenticated, handlers.user.getMyProducts)
    app.get('/user/product/details/:id',auth.isAuthenticated, handlers.user.getUserProductDetails)
    app.get('/user/boughtProducts', auth.isAuthenticated, handlers.user.getBoughtProducts)

    app.post('/product/search', handlers.product.search)
    app.get('/product/search', handlers.product.search)
}