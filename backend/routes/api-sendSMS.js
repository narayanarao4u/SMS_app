require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");

const moment = require('moment')

router.get("/", (req, res) => {
  res.json({ msg: "hello..." });
});

router.post("/", async (req, res) => {
  let smsdata = req.body;
  let msg = encodeURI(smsdata.text)
  // let msg = smsdata.text
  
    
  console.log('msg:', msg);
  const smsbaseurl = `http://117.239.146.110:13131/cgi-bin/sendsms?username='admin'&password='secret'&from=${smsdata.Header}&to=91${smsdata.to}&text=${msg}&dlr-mask=31&dlr-url=http%3A%2F%2F117.239.146.110%3A3001%2FGetStatus%3Ftype%3D%25d%26dlrv%3D%25d%26msgId%3D%25F%26rep%3D%25A%26time%3D%25t%26sender%3D%25P%26receiver%3D%25p&meta-data=%3Fsmpp%3FPE_ID%3D1401607730000015818%26Template_ID%3D${smsdata.Template_ID}    `;

  // console.log(smsdata);

  console.log('------');
  console.log(smsbaseurl)
  console.log('------');
  const response = await axios.get(smsbaseurl);
  // console.log(response);

  res.status(200).json({ msg: "success" });
});


router.post("/bulk", async (req, res) => {
  let smsdata = req.body;
  let msg = encodeURI(smsdata.text)
  // let msg = smsdata.text
  let response = [];
  if(Array.isArray(smsdata.to) && smsdata.to.length > 0){
    
    smsdata.to.forEach(async (to) => {  
     const smsbaseurl = `http://117.239.146.110:13131/cgi-bin/sendsms?username='admin'&password='secret'&from=${smsdata.Header}&to=91${to.Phone}&text=${msg}&dlr-mask=31&dlr-url=http%3A%2F%2F117.239.146.110%3A3001%2FGetStatus%3Ftype%3D%25d%26dlrv%3D%25d%26msgId%3D%25F%26rep%3D%25A%26time%3D%25t%26sender%3D%25P%26receiver%3D%25p&meta-data=%3Fsmpp%3FPE_ID%3D1401607730000015818%26Template_ID%3D${smsdata.Template_ID}    `;
     
       const res = await axios.get(smsbaseurl); 
     
      response.push({to: to.Phone, msg: "success"});
   })
  }
    
  res.status(200).json( { msg: "success", response: response} );

});

// api/COVJOTP
router.post("/COVJOTP", async (req, res) => {
  let smsdata = req.body;
  let Header = "APBSNL";
  let Template_ID = "1407171629376818013";

  const smsbaseurl = `http://117.239.146.110:13131/cgi-bin/sendsms?username='admin'&password='secret'&from=${Header}&to=91${smsdata.to}&text=${smsdata.text}&dlr-mask=31&dlr-url=http%3A%2F%2F117.239.146.110%3A5000%2FGetStatus%3Ftype%3D%25d%26dlrv%3D%25d%26msgId%3D%25F%26rep%3D%25A%26time%3D%25t%26sender%3D%25P%26receiver%3D%25p&meta-data=%3Fsmpp%3FPE_ID%3D1401607730000015818%26Template_ID%3D${Template_ID}    `;


  const currentTimestamp = moment();
  smsdata.timestamp = currentTimestamp.format();
  console.log(smsdata);

  const response = await axios.get(smsbaseurl);
  // console.log(response);

  res.status(200).json({ msg: "success" });
});

module.exports = router;
