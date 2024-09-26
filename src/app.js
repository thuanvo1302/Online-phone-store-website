let createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars')
var path = require('path');
var cookieParser = require('cookie-parser')
const flash = require('express-flash')
const session = require('express-session')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var customersRouter = require('./routes/customers');
var ordersRouter = require('./routes/order');
var suppliersRouter = require('./routes/supplier')
var categoryRouter = require('./routes/category')
var cartRouter = require('./routes/cart')

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


var app = express();

// Create an instance of Express Handlebars with prototype access
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(exphbs.create().handlebars),
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'msi',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000, secure: false }
}))

// app.use(cors())

// router render
app.use('/products', require('./clients/product'))
app.use('/customers', require('./clients/customer'))
app.use(require('./clients/sale'))

// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter)
app.use('/suppliers', suppliersRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/auth', require('./routes/auth'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    console.log("🚀 ~ file: app.js:80 ~ err:", err)

    if (err.status === 404) {
        return res.render('page-error-404')
    }

    res.status(err.status || 500).send('500 - server error');
});

module.exports = app;
