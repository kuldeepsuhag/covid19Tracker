import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  Legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
          
        const newDatapoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDatapoint);
      }
      lastDataPoint = data[casesType][date];
      
    }
    return chartData;
  };
function LineGraph2({casesType = 'cases',...props}) {
  const [data, setdata] = useState({});

  //https://disease.sh/v3/covid-19/historical/all?lastdays=200
  useEffect(() => {
    const fetchData = async () => {
      fetch(`https://disease.sh/v3/covid-19/historical/${props.country}?lastdays=120`)
        .then((response) => response.json())
        .then(({timeline}) => {
           console.log('India',timeline)
          const chartData = buildChartData(timeline, casesType);
          setdata(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph2;
