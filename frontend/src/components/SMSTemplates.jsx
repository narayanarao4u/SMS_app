import React, { createContext, useContext, useEffect, useState } from "react";

import { useFetchAPI } from "../customHooks/customHooks";
import Papa from "papaparse";

import axios from "axios";

const DataContext = createContext(null);

function SMSTemplates() {
  const baseurl = import.meta.env.VITE_SERVER_URL;

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contentTemplate, setContentTemplate] = useState(null);

  const [searchText, setSearchText] = useState("");

  // const [URL, setURL] = useState(`${baseurl}/api/templateIds`);
  const { data, isError, isLoading } = useFetchAPI(`${baseurl}/api/templateIds`);

  const [dispData, setDispData] = useState([]);

  useEffect(() => {
    if (data) {
      setDispData(
        data.data.filter((item) =>
          item.TEMPLATE_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
          item.TEMPLATE_ID.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [data, searchText]);
  return (
    <div className="container border rounded border-info">
      <h2>SMS Templates</h2>
      <div>
        <input
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search"
          className="form-control"
        />
        <hr />
        {/* <pre>{JSON.stringify(dispData, null, 2)}</pre> */}
      </div>
      {isLoading
        ? "Loading..."
        : isError
          ? "Error"
          : data && (
            <DataContext.Provider
              value={{
                selectedTemplate,
                setSelectedTemplate,
                contentTemplate,
                setContentTemplate,
              }}
            >
              <div className="row">
                <div className="col-4">
                  <DisplayTemplates dispData={dispData} />
                </div>
                <div className="col-8">
                  <GetSMSTemplates />
                </div>
              </div>
            </DataContext.Provider>
          )}
    </div>
  );
}

function DisplayTemplates({ dispData }) {
  const { selectedTemplate, setSelectedTemplate } = useContext(DataContext);

  return (
    <div className="templatesDiv">
      {dispData.map((item, index) => {
        return (
          <div
            key={index}
            className={
              selectedTemplate?.TEMPLATE_ID === item.TEMPLATE_ID
                ? `m-1 border-bottom border-info p-1 bg-info text-white`
                : `m-1 border-bottom border-info p-1 `
            }
            role="button"
            onClick={() => setSelectedTemplate(item)}
          >
            {item.TEMPLATE_NAME}
          </div>
        );
      })}
    </div>
  );
}

function GetSMSTemplates() {
  const { selectedTemplate, setContentTemplate } = useContext(DataContext);
  const baseurl = `${import.meta.env.VITE_SERVER_URL
    }/api/Get_Content_Template_Details`;
  const [url, setUrl] = useState(null);
  const [POST_DATA, setPOST_DATA] = useState(null);

  const { data, isError, isLoading } = useFetchAPI(url, POST_DATA);

  useEffect(() => {
    if (selectedTemplate) {
      setUrl(`${baseurl}?Content_Template_Id=${selectedTemplate.TEMPLATE_ID}`);

      setPOST_DATA({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content_Template_Id: selectedTemplate.TEMPLATE_ID,
          Content_Template_Name: "",
        }),
      });
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (data) {
      setContentTemplate(data);
    }
  }, [data]);

  return (
    <div>
      {selectedTemplate && (
        <p>
          Template ID : {selectedTemplate.TEMPLATE_ID} <br /> Template Name :{" "}
          {selectedTemplate.TEMPLATE_NAME}
        </p>
      )}

      {isLoading
        ? "Loading..."
        : isError
          ? "Error"
          : data && (
            <>
              <ContentTemplate />

              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </>
          )}
    </div>
  );
}

function ContentTemplate() {
  const { contentTemplate } = useContext(DataContext);
  const [error, setError] = useState("");

  const data = contentTemplate && contentTemplate.Content_Template_Ids[0];
  const initsmsData = {
    to: "9490044441",
    text: "hello",
    Template_ID: "",

  }
  const [smsdata, setSmsData] = useState({ ...initsmsData });

  const baseurl = `${import.meta.env.VITE_SERVER_URL}/api_sendsms`;

  const [smsresponse, setSmsResponse] = useState(null);

  const [parsedData, setParsedData] = useState([]);
  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);
  //State to store the values
  const [values, setValues] = useState([]);


  function handlesendsms() {
    axios.post(baseurl, smsdata).then((res) => {
      setSmsResponse(res.data);
    })
  }

  function handlebulksms() {
    axios.post(baseurl + "/bulk", smsdata).then((res) => {
      setSmsResponse(res.data);
    })
    console.log(smsdata);
  }


  useEffect(() => {
    if (contentTemplate) {
      let d = contentTemplate.Content_Template_Ids[0];
      setSmsData({
        ...initsmsData,
        Template_ID: d.Template_Id,
        Header: d.Header,
        text: d.Template_Message_DLT
      });

    }
  }, [contentTemplate])

  function handleInputFile(e) {
    if (e.target.files.length > 0) {
      let file = e.target.files[0];
      const fileExtension = file?.type.split("/")[1];

      if (fileExtension !== "csv") {
        console.log("fileExtension :", fileExtension);
        setError("Please input a csv file");
        return;
      } else {
        Papa.parse(event.target.files[0], {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            let validNo = results.data.filter((data) => data["Phone"].length === 10);
            setError('No of valid numbers : ' + validNo.length);
            setSmsData({ ...smsdata, to: validNo })
          },
        });
      }

    }
  }

  return (
    <>

      {data && (
        <>
          <div className="row mb-3 bg-info">
            <div className="col-3">
              <b>Header : </b> {data?.Header}
            </div>
            <div className="col-3">
              <b>MSG Type : </b> {data?.Message_Type}
            </div>

          </div>

          <div className="row">
            <div className="col-4">
              <input
                type="text"
                placeholder="Enter Phone No"
                className="form-control"
                value={smsdata.to}
                onChange={(e) => setSmsData({ ...smsdata, to: e.target.value })}
              />

            </div>
            <div className="col-2 text-center ">
              <button className="btn btn-primary btn-sm" onClick={handlesendsms} >Send</button>
            </div>
            <div className="col-4">
              <input
                type="file"
                name="file"
                accept=".csv"
                placeholder="Enter Phone No"
                className="form-control"
                onChange={handleInputFile}
              />
              <p className="text-danger">{error}</p>
            </div>
            <div className="col-2 text-center ">
              <button className="btn btn-primary btn-sm" onClick={handlebulksms} >Send</button>
            </div>
          </div>
          <div>
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              className="form-control"
              value={smsdata.text}
              onChange={(e) => setSmsData({ ...smsdata, text: e.target.value })}
            >

            </textarea>

            <pre>
              {/* {JSON.stringify(contentTemplate, null, 2)} */}
              <br />

              smsresponse :  {JSON.stringify(smsresponse, null, 2)}

            </pre>
          </div>
        </>
      )}
    </>
  );
}

export default SMSTemplates;
