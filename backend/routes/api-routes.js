require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const templateIds = require("./../tempaleID.json");

const CRUD = require('../controllers/common.controller');
let crud = new CRUD();
const Document = require('../models/tempmlateIDs.model').templateID


router.get("/", (req, res) => {
  res.json({ msg: "hello..." });
});

router.get("/smsbalance", async (req, res) => {
  try {
    let data = "";

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://${process.env.BASE_URL}/api/Get_SMS_Count`,
      // url: "https://bulksms.bsnl.in:5010/api/Get_SMS_Count",
      headers: {
        Authorization: process.env.AUTHORIZATION,
      },
      data: data,
    };

    // Make the request to the URL
    const response = await axios.request(config);

    // Ensure the request was successful
    if (response.status === 200) {
      // Send the data as JSON response
      //   console.log(response);
      res.json(response.data);
    } else {
      // Handle unsuccessful request (e.g., log error, send error message to client)
      res.status(response.status).send("Error fetching data");
    }
  } catch (error) {
    // Handle errors during the request or response processing
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

/* router.get("/templateIds", (req, res) => {
  res.json(templateIds);
}); */
router.route('/templateIds')
  .get(crud.index.bind(Document))

router.post("/Get_Content_Template_Details", async (req, res) => {
  try {
    let data = req.body;

    // console.log(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://${process.env.BASE_URL}/api/Get_Content_Template_Details`,
      headers: {
        Authorization: process.env.AUTHORIZATION,
      },
      data: data,
    };

    // Make the request to the URL
    const response = await axios.request(config);

    // Ensure the request was successful
    if (response.status === 200) {
      // Send the data as JSON response
      //   console.log(response);
      res.json(response.data);
    } else {
      // Handle unsuccessful request (e.g., log error, send error message to client)
      res.status(response.status).send("Error fetching data");
    }
  } catch (error) {
    // Handle errors during the request or response processing
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
