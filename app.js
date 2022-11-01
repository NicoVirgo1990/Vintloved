const express = require('express');
const path = require('path');
const { prototype } = require('npm-run-all/lib/npm-run-all-error');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const { PromiseProvider } = require('mongoose');
const helmet = require('helmet');
const contentSecurityPolicy = require('helmet-csp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const modelRouter = require('./routes/modelRouter');
const userRouter = require('./routes/userRouter');
const itemRouter = require('./routes/itemRouter');
const blogRouter = require('./routes/blogRouter');
const viewRouter = require('./routes/viewsRouter');
const hpp = require('hpp');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// security HTTP headers
app.use(helmet({
	crossOriginEmbedderPolicy: false
}));

app.use(helmet.contentSecurityPolicy());




// These directives override default helmet headers, which are just self, so default helmets only load or server data which is from your own server, So we need to tell helmet that along with self headers,we also want to load data from these headers.
// So in future if you add any other script, add in script-src directive, style in style-src and so on
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			'script-src': [
				"'self'",
				'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js',
				'https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/esm/axios.min.js.map',
				"https://unpkg.com/axios/dist/axios.min.js"
			],
			'style-src': ["'self'", 'https://fonts.googleapis.com/'],
			'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
			'frame-src': ["'self'", 'https://widget.trustpilot.com/', 'https://mozbar.moz.com/'],
		},
	})
);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

//MIDDLEWARE

// const scriptSources = ["'self'" ,'https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/esm/axios.min.js.map'];
// app.use(
//   contentSecurityPolicy({
//     directives: {
//       defaultSrc: contentSecurityPolicy.dangerouslyDisableDefaultSrc,
//       scriptSrc: scriptSources
//     },
//   })
// );

// development log in
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// body parser: reading data from the body into req.body
app.use(
	express.json({
		limit: '10kb',
	})
);

// data sanitization against noSQL query injection

app.use(mongoSanitize());

//data sanitization against XSS

app.use(xss());

//  prevent parameter pollution
app.use(
	hpp({
		whitelist: ['brand', 'model', 'ratingsAverage', 'ratingsQuantity'],
	})
);

console.log(path.join(__dirname, 'public'), 'CIAO');

// serving static file
app.use(express.static(path.join(__dirname, 'public')));

// max 100 from the same IP in one hour
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Troppe richieste da questo IP, prova tra un'ora",
});

//
app.use('/api', limiter);

//mounting the routers

app.use('/', viewRouter);
app.use('/api/v1/models', modelRouter);
app.use('/api/v1/users', userRouter);
console.log('sto prima di items su app.js');
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/blogs', blogRouter);

// this handle the wrong URL's
app.all('*', (req, res, next) => {
	next(new AppError(`Cant't find ${req.originalUrl} on this server `, 404));
});

// global errors handler

app.use(globalErrorHandler);

module.exports = app;

