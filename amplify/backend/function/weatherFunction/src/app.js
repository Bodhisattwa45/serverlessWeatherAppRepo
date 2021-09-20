const {requestGeocode, requestForecast}=require('postman-request')
var express = require('express')
//var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
//app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/
 app.get('/weather',(req,res)=>{
  if(!req.query.address){
      return res.json({
          error:'You must provide an address'
      })
  }
geoCode(req.query.address,(error,{latitude,longitude,placeName}={})=>{
  if(error){
      return res.json({error})
  }
  forecast(latitude, longitude, (error, forecastData={}) => {
      if(error){
          return res.json({error})
      }
      //log(placeName)
      //log(forecastData)
      res.json({
          Place: placeName,
          WeatherReport: forecastData
      })
  })
})
})

const geoCode=(place,callback)=>{
    const mapboxToken='pk.eyJ1IjoiYm9kaGlzYXR0d2E0NSIsImEiOiJja3Mwc3RiM2YwODQ2Mm5yeWhuNnZqNnBnIn0.u-5Uxh9TL388hlQ0HHX7xg'
    const fwGeocodeurl=`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxToken}&limit=1`
    requestGeocode({url: fwGeocodeurl,json: true},(error,{body,statusCode}={})=>{
        if(error){
            callback('Unable to connect to Geocoding Service!!!',undefined)
        }else if(statusCode===404){
            callback('Something went wrong...Please search again with correct address text!!!',undefined)
        }else if(!body.features.length){
                callback('Address not found!!!',undefined)
        }else{
            callback(undefined,{
                placeName:body.features[0].place_name,
                longitude:body.features[0].center[0],
                latitude:body.features[0].center[1]
            })
        }
    })
}

const forecast=(lat,long,callback)=>{
    const WSApiKey='0810e678c0843b48c7d2bad9bf4561a3'
    const forecastURL=`http://api.weatherstack.com/current?access_key=${WSApiKey}&query=${lat},${long}`
    requestForecast({url:forecastURL,json:true},(error,{body}={})=>{
        if(error){
            callback('Unable to connect to Weather Forecast Service!!!',undefined)
        }
        else if(body.error){
            callback('Invalid or missing location query parameter!!!',undefined)
        }
        else{
            const temperature=body.current.temperature
            const precipitation=body.current.precip
            const precipPercent=precipitation*100
            const weatherCondition=body.current.weather_descriptions[0]
            //let weatherData=`Overall weather condition is ${weatherCondition}\n
            //it is currently ${temperature} degrees out there\n
            //There is a ${precipPercent}% chance of rain`
            const weatherData={
                Weather: weatherCondition,
                Temprature: temperature,
                RainChance: precipPercent
            }
            callback(undefined,weatherData)
        }
    })
}

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
