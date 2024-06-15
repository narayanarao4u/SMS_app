import React, { useEffect, useState } from "react";

import { Card, Button } from "react-bootstrap";

function GetSmsCredits() {
  const baseurl = import.meta.env.VITE_SERVER_URL;

  const [balmsg, setBalMsg] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setBalMsg(undefined);

    const controller = new AbortController();

    const URL = `${baseurl}/api/smsbalance`;

    fetch(URL, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return Promise.reject(res);
      })
      .then((data) => {
        setBalMsg(data);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []); //end of useEffect

  let jsx;

  if (loading) {
    console.log("GET SMS CREDITS LOADING...");
    jsx = <h2>Loading..</h2>;
  } else if (error != null) {
    jsx = <pre>{JSON.stringify(error, null, 2)}</pre>;
  } else {
    if (balmsg) {
      if (balmsg.Recharge_Details.length === 0) {
        jsx = <h3>{balmsg.Error}</h3>
      } else {

        let Recharge_Details = balmsg.Recharge_Details[0];

        // jsx = "success"
        // jsx = (<span>{JSON.stringify(balmsg.Recharge_Details[0].SMS_Balance_Count, null, 2)}</span>)
        // jsx = (<pre>{JSON.stringify(balmsg.Recharge_Details[0].SMS_Balance_Count, null, 2)}</pre>)
        jsx = (
          <div className="text-left">
            <div className="row">
              <strong className="col-md-4 no-wrap">SMS_Balance_Count :</strong>
              <span className="col text-success h5">
                {" "}
                {Recharge_Details?.SMS_Balance_Count}
              </span>
            </div>
            <div className="row">
              <strong className="col-md-4 no-wrap">Balance as On :</strong>
              <span className="col">{Recharge_Details?.Balance_Updated_Time}</span>
            </div>
            <div className="row">
              <strong className="col-md-4 no-wrap">Balance_Expiry_Time : </strong>
              <span className="col">
                {" "}
                {Recharge_Details?.Balance_Expiry_Time}{" "}
              </span>
            </div>
          </div>
        );

      }

    } else {
      jsx = <pre>{JSON.stringify(balmsg, null, 2)}</pre>;
    }

    // jsx = (<pre>{JSON.stringify(balmsg, null, 2)}</pre>)
  }

  return (
    // <Card>
    //   <Card.Body>
    //     <Card.Title>SMS Credit Balance</Card.Title>
    //     {/* <Card.Text>{balmsg.Recharge_Details[0].SMS_Balance_Count}</Card.Text> */}
    //     <Card.Text>{jsx}</Card.Text>
    //   </Card.Body>
    // </Card>
    <div className="container border rounded border-primary">{jsx}</div>
  );
}

export default GetSmsCredits;
