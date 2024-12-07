import express from "express";
import cors from "cors";
//for the .env file
import dotenv from "dotenv";

const app = express();
const port = 4000;
dotenv.config();
/*app.use(
    cors({
      origin: [
        "http://localhost:4000"//,
        //"https://backend-927c.onrender.com",
        //"https://frontend-9vuf.onrender.com",
      ], // Replace with your frontend's origin
    })
  );*/

app.get("/api", (req, res) => {
  //get the query for the api search
  let input = req.query.input;
  //fetch the data & use the process.env to get the hidden api key
  fetch(
    process.env.REACT_APP_API_LINK_BASE_GEO +
      input +
      "&limit=5&appid=" +
      process.env.REACT_APP_API_KEY,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      //send back the data
      res.json(data);
      return { data };
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/weatherCall", (req, res) => {
  //get the lat & lon from the call
  let lon = req.query.lon;
  let lat = req.query.lat;
  //fetch data using the given lat&lon
  //handle response
  fetch(
    process.env.REACT_APP_API_LINK_BASE_WEATHER +
      "lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      process.env.REACT_APP_API_KEY +
      "&units=imperial",
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("network response not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
      return { data };
    })
    .catch((error) => {
      console.log(error);
    });
});
app.get("/hourlyCall", (req, res) => {
  const lon = req.query.lon;//getting lat and longitutde from onecall
  const lat = req.query.lat;

  
  const apiUrl =
    process.env.REACT_APP_API_LINK_BASE_ONECALL +
    "lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,daily,alerts&appid=" +
    process.env.REACT_APP_API_KEY +
    "&units=imperial";//assembles link to run

  console.log("API URL:", apiUrl); // debugging the API URL

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        console.error("Status Code:", response.status); // testing status code
        return response.text().then((errorDetails) => {
          console.error("Error Details:", errorDetails); // log details of error
          throw new Error("Failed to fetch hourly data");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Hourly Data:", data); // logging data
      res.json(data); // sending hourly data to our frontend
    })
    .catch((error) => {
      console.error("Error:", error.message);
      res.status(500).send("Error fetching hourly data");//error message
    });
});


//log that the server is running properly
app.listen(port, () => console.log(`Server running on port ${port}`));