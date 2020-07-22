import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import "./App.css";
import Table from "./components/Table";
import { sortData, prettyPrintState } from "./components/utils";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import LineGraph2 from "./components/LineGraph2";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setcountry] = useState("worldwide");
  const [countryInfo, setcountryInfo] = useState({});
  const [tableData, settableData] = useState([]);
  const [mapCenter, setmapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  // State = How to write a variable in react

  // https://disease.sh/v3/covid-19/countries

  // USEEFFECT = Runs a piece pof code
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setcountryInfo(data);
      });
  }, []);
  useEffect(() => {
    // the code inside here will run once
    //  when the component loads and not again
    // async -> send a request to a server, wait for it, do something with info,

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          
          const countries = data.map((country) => ({
            name: country.country, // United State
            value: country.countryInfo.iso2,
            label: country.country // UK,USA,FR
          }));
          const sortedData = sortData(data);
          settableData(sortedData);
          setCountries(countries);
          setmapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("CountryCode", event);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setcountry(countryCode);
        setcountryInfo(data);

        countryCode === "worldwide"
          ? setmapCenter({ lat: 34.80746, lng: -40.4796 })
          : setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === "worldwide" ? setmapZoom(2) : setmapZoom(4);
      });
  };
  // console.log("Country Info", countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div classN ame="app__header">
          <h1>Covid-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* Loop through all the countries and show the dropdown list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintState(countryInfo.todayCases)}
            total={prettyPrintState(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            title="Recovered"
            onClick={(e) => setcasesType("recovered")}
            cases={prettyPrintState(countryInfo.todayRecovered)}
            total={prettyPrintState(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            title="Deaths"
            onClick={(e) => setcasesType("deaths")}
            cases={prettyPrintState(countryInfo.todayDeaths)}
            total={prettyPrintState(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          {country === "worldwide" ? (
            <div>
              <h3 className="app__graphTitle">
                {country} new {casesType}
              </h3>
              <LineGraph className="app__graph" casesType={casesType} />
            </div>
          ) : (
            <div>
              <h3 className="app__graphTitle">
                {country} new {casesType}
              </h3>
              <LineGraph2
                className="app__graph"
                country={country}
                casesType={casesType}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
