const buy_invoice_detailsRouter = require('./buy_invoice_details');
const buy_invoicesRouter = require('./buy_invoices');
const cartsRouter = require('./carts');
const categoriesRouter = require('./categories');
const customersRouter = require('./customers');
const employeesRouter = require('./employees');
const productsRouter = require('./products');
const rolesRouter = require('./roles');
const sale_invoice_detailsRouter = require('./sale_invoice_details');
const sale_invoicesRouter = require('./sale_invoices');
const suppliersRouter = require('./suppliers');
const loginRoute = require('./login');
const authRoute = require('./auth');

const authenticateToken = require('../authMiddleware');

function route(app) {
    app.use('/buy_invoice_details', buy_invoice_detailsRouter);
    app.use('/buy_invoices', buy_invoicesRouter);
    app.use('/carts', cartsRouter);
    app.use('/categories', categoriesRouter);
    app.use('/customers', customersRouter);
    app.use('/employees', employeesRouter);
    app.use('/products', productsRouter);
    app.use('/roles', rolesRouter);
    app.use('/sale_invoice_details', sale_invoice_detailsRouter);
    app.use('/sale_invoices', sale_invoicesRouter);
    app.use('/suppliers', suppliersRouter);
    app.use('/login', loginRoute); 
    app.use('/auth', authRoute);

    app.use('/', employeesRouter);
}

module.exports = route;
