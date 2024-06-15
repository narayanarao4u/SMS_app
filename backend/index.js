const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const moment = require('moment');


const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'dlr',
  password: 'kannel_user',
});
 


const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(function(req, res, next){
  let bodydata = req.body;
  const currentTimestamp = moment();
  bodydata.timestamp = currentTimestamp.format();
  console.log("IP Address :", req.ip);
  console.log("url :", req.originalUrl);
  console.log(bodydata);
  console.log('*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*');

  next()
})


//#region connect to mongodb

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const connStr = "mongodb://localhost:27017/bsnlSMS";
// Connecting to the database
mongoose.connect(connStr, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

//#region connect to mongodb


app.get('/',(req,res)=>{
    res.send("Hello World!");
});


app.get('/GetStatus', async (req, res) => {	
    const deliveryStatus = req.query.dlrv;
    const type = req.query.type;
    console.log("type :", type);
    console.log("Report :",req.query.rep);

    if(type==1){
	    const rep = req.query.rep;
	    const arr = rep.split(" ");
	    const msgId = arr[0].split(':')[1];
	    const status = arr[7].split(':')[1];
	    const sbtDt = arr[4].split(':')[1];
	    const dlrDt = arr[6].split(':')[1];
	    const errCd = arr[8].split(':')[1];
	    const sender = req.query.sender;
	    const receiver = req.query.receiver;
	    try{
	    	const connection = await pool.getConnection();
	    	const sql = 'INSERT INTO `dlr_final`(`msgId`,`status`,`sbt_dt`,`dlr_dt`,`err_cd`,`sender`,`receiver`) VALUES (?,?,?,?,?,?,?)';
	    	const [results,fields] = await connection.query(sql,[msgId,status,sbtDt,dlrDt,errCd,sender,receiver]);
	    	console.log(results);
	    	console.log(fields);    
	    	connection.release();
	    }catch(err){
	    	console.log("error :",err)
	    }
    }else{
        console.log("Finaltype :",type);
    } 

     console.log("--End of Get--");
     res.sendStatus(200);
});


app.use("/api", require("./routes/api-routes"));
app.use("/api_sendsms", require("./routes/api-sendSMS"));

const PORT = 3001;
app.listen(PORT, () => console.log(`Listing on http://localhost:${PORT}`));
