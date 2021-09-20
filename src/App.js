import React from 'react';
import logo from './logo.svg';
import './App.css';
import ForecastData from './forecastData';
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

class App extends React.Component{
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
           <h1>Weather App</h1>
          <br/>
          <div id="SignoutBtn"><AmplifySignOut/></div>
          <br/>
          <ForecastData/>
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App, true)
