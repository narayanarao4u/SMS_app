import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/bsnl-logo.jpg"
import logosms from "./assets/SMS_logo.png"
import "./App.css";

import GetSmsCredits from "./components/GetSmsCredits";
import SMSTemplates from "./components/SMSTemplates";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <div className="banner">
          <img src={logo} alt="logo" srcset="" />
         <h1 >BSNL AP Circle SMS</h1>
         <img src={logosms} alt="logo" srcset="" />
      </div>
      
      {/* <GetSmsCredits /> */}
      <SMSTemplates />
    </div>
  );
}

export default App;
