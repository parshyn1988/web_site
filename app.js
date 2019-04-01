'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('express-favicon');
var orders = require('./data/orders');
var nodemailer = require('nodemailer');
var app = express();

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'yourexmple@mail.com',
		pass: 'yourpassword'
	}
});

app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/i/favicon.png'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index', {title: 'The Cafe'});
});

app.get('/about', function(req, res) {
	res.render('about', {title: 'About'});
});

app.get('/menu', function(req, res) {
	res.render('menu', {title: 'Menu'});
});

app.get('/contact', function(req, res) {
	res.render('contact', {title: 'Contact'});
});

app.get('/order', function(req, res) {
	res.render('order', {
		title: 'Order',
		orders: orders
	})
});

app.post('/contact', function(req, res) {
	var order = {
		id: Date.now(),
		name: req.body.name,
		number: req.body.number,
		date: req.body.date,
		message: req.body.message,
		email: req.body.email
	};
	orders.push(order);

	var mailOptions = {
		from: 'yourexmple@mail.com',
		to: req.body.email,
		subject: 'Order',
		html: '<h1>Order</h1><br>'+
			'<h2>' + req.body.name + '</h2><br>' +
			'<p>number: ' + req.body.number + '</p><br>' +
			'<p>date: ' + req.body.date + '</p><br>' +
			'<p>message: ' + req.body.message + '</p>'
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	res.redirect('/order');

});

app.listen(3000, function() {
	console.log('app is listened at localhost:3000');
});