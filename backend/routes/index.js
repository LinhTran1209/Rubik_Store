
const sale_invoice_detailsRouter = require('./sale_invoice_details');
const sale_invoicesRouter = require('./sale_invoices');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const cartsRouter = require('./carts');
const newsRouter = require('./news');
const authRoute = require('./auth');

const authenticateToken = require('../authMiddleware');

function route(app) {
    app.use('/sale_invoice_details', sale_invoice_detailsRouter);
    app.use('/sale_invoices', sale_invoicesRouter);
    app.use('/categories', categoriesRouter);
    app.use('/products', productsRouter);
    app.use('/users', usersRouter);
    app.use('/carts', cartsRouter);
    app.use('/news', newsRouter);
    app.use('/auth', authRoute);

    app.use('/',authenticateToken, usersRouter);
}

module.exports = route;
