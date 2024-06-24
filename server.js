require('dotenv').config();
const express = require('express')
const bodyParser= require('body-parser')
const request = require('request');
const app = express();
const apiKey = process.env.API_KEY; 

// Importar Middlewares
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");


// Logger
app.use(morgan(':method :host :url :status :param[id] - :response-time ms :body'));

//habilito carpetas public para archivos estaticos
app.use(express.static('public'));

//Para detectar en el body un string de una ciudad
app.use(bodyParser.urlencoded({ extended: true }));

//Configuracion de vistas EJS
app.set('view engine', 'ejs')

//Ejemplo Hello World
/* app.get('/', function (req, res) {
    res.send('Hello World!')
  }) */

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
          res.render('index', {weather: null, error: 'Error, detectado un err'});
        } else {
          let weather = JSON.parse(body)
          if(weather.main == undefined){
            console.log(weather)
            console.log(apiKey)
            res.render('index', {weather: null, error: 'Error, weather is undefined'});
          } else {
            let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            res.render('index', {weather: weatherText, error: null});
          }
        }
      });
    })

//aplicacion de error 404
app.use(error404); //Middleware gestiona el 404


//puerto de salida
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})