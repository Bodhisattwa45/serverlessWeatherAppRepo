import Auth from '@aws-amplify/auth'
import React from 'react'

class ForecastData extends React.Component{
    /*componentDidMount(){
    const weatherForm = document.querySelector('form')
    const search = weatherForm.querySelector('#Placename')
    const para1 = document.querySelector('#OutputElements > p#msg-1')
    const para2 = document.querySelector('#OutputElements > p#msg-2')
    weatherForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        const location = search.value
        const URL = `/weather?address=${location}`//http://localhost:3000 as not running in localhost
        para1.textContent='...Loading Weather Data...'
        para2.textContent=' '
        fetch(URL).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                para1.textContent = data.error
                console.log(data.error)
            }
            else{
                para1.textContent = `Location: ${data.Place}`
                para2.textContent = `Weather: ${data.WeatherReport.Weather}, Temprature: ${data.WeatherReport.Temprature}, RainChance: ${data.WeatherReport.RainChance}%`
                console.log(`Location: ${data.Place}`)
                console.log(`Weather: ${data.WeatherReport.Weather}, Temprature: ${data.WeatherReport.Temprature}, RainChance: ${data.WeatherReport.RainChance}%`)
            }
        })
    })
    })
    }*/
    constructor(props) {
        super(props)
    
        this.state = {
             placename:'',
             loading: true,
             forecast: null
        }
    }
    handlePlacenameChange=(event)=>{
        this.setState({
            placename:event.target.value
        })
    }

    onSubmit=async (event)=>{
        event.preventDefault()
        const placename=this.state.placename
        const URL = `/weather?address=${placename}`//http://localhost:3000 as not running in localhost
        const user= await Auth.currentAuthenticatedUser()
        const token = user.signInUserSession.idToken.jwtToken
        fetch(URL,{
            method:'GET',
            headers:{
                Authorization:token
            }
        }).then((response)=>{
        response.text().then((data)=>{
            if(data.error){
                //console.log(data.error)
                this.setState({loading: false,forecast:data.error})
            }
            else{
                //console.log(`Location: ${data.Place}`)
                //console.log(`Weather: ${data.WeatherReport.Weather}, Temprature: ${data.WeatherReport.Temprature}, RainChance: ${data.WeatherReport.RainChance}%`)
                this.setState({loading:false,forecast:data})
            }
        })
    })
    }
    render(){
      return (
    <div id="Elemnts">
        <form onSubmit={this.onSubmit}>
          <input id="Placename" type="text" placeholder="location" value={this.state.placename} onChange={this.handlePlacenameChange}/>
          <button id="Submitbtn" type="submit">Get Forecast</button>
        </form>
        <div id="msg-1">{this.state.loading && !this.state.forecast?<div>No Location Searched</div>:<div>Location:{this.state.forecast.Place}</div>}</div>
        <div id="msg-2">{!this.state.forecast?<div>No Forecast Available</div>:<div>Forecast:{this.state.forecast.WeatherReport}</div>}</div>
    </div>
      )
    }

    }

    export default ForecastData