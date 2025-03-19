// import HomePage from '../pages/home/index.js';

import Role from '../pages/roles/index.js';
import Employee from '../pages/employees/index.js';
import Customer from '../pages/customers/index.js';
import Supplier from '../pages/suppliers/index.js';
import Categorie from '../pages/categories/index.js';
import Product from '../pages/products/index.js';
import BuyInvoice from '../pages/buy_invoices/index.js';
import SaleInvoice from '../pages/sale_invoices/index.js';


import HomePage from '../pages/home/index.js'
  


const publicRoutes = [
    {}
];


const privateRoutes = [
    {path: '/roles', component: Role},
    {path: '/employees', component: Employee},
    {path: '/customers', component: Customer},
    {path: '/suppliers', component: Supplier},
    {path: '/categories', component: Categorie},
    {path: '/products', component: Product},
    {path: '/buy_invoices', component: BuyInvoice},
    {path: '/sale_invoices', component: SaleInvoice},
];

export { publicRoutes, privateRoutes };