import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import GetSmsCredits from "./components/GetSmsCredits";
import SMSTemplates from "./components/SMSTemplates";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1 className="text-center">BSNL AP Circle SMS</h1>
      <GetSmsCredits />
      <SMSTemplates />
    </div>
  );
}

export default App;
