
const sale_invoice_detailsRouter = require('./sale_invoice_details');
const product_variantsRouter = require('./product_variants');
const user_addressesRouter = require('./users_addresses');
const product_imagesRouter = require('./product_images');
const sale_invoicesRouter = require('./sale_invoices');
const categoriesRouter = require('./categories');
const productsRouter = require('./products');
const usersRouter = require('./users');
const cartsRouter = require('./carts');
const newsRouter = require('./news');
const authRoute = require('./auth');



function route(app) {
    app.use('/sale_invoice_details', sale_invoice_detailsRouter);
    app.use('/product_variants', product_variantsRouter);
    app.use('/users_addresses', user_addressesRouter);
    app.use('/product_images', product_imagesRouter);
    app.use('/sale_invoices', sale_invoicesRouter);
    app.use('/categories', categoriesRouter);
    app.use('/products', productsRouter);
    app.use('/users', usersRouter);
    app.use('/carts', cartsRouter);
    app.use('/news', newsRouter);
    app.use('/auth', authRoute);

    app.use('/', usersRouter);
}

module.exports = route;
