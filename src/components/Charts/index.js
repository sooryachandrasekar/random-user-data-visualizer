/** @format */

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import _ from "lodash";
import { getRandomUserData } from "../Table";
import { chartColors } from "./colors";

const pieOptions = {
  legend: {
    display: true,
    position: "top",
  },
  elements: {
    arc: {
      borderWidth: 0,
      hoverOffset: 20,
    },
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];
        var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
        return currentValue + " (" + percentage + "%)";
      },
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      },
    },
  },
};

const getChartData = (result) => {
  return {
    maintainAspectRatio: false,
    responsive: true,
    labels: result.labels,
    options: { pieOptions },
    datasets: [
      {
        data: result.values,
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };
};

const getMappedUserData = (data) => {
  let chartLabels = [];
  let chartData = [];
  let result = {};
  let dataByLocations = [];
  data.map((item) => {
    if (item.location) {
      dataByLocations.push(item.location);
    }
    return dataByLocations;
  });
  if (dataByLocations.length > 0) {
    dataByLocations = _.groupBy(dataByLocations, "country");
    let locationCount = Object.keys(dataByLocations).length;
    if (locationCount > 5) {
      let sortingCountryNames = Object.keys(dataByLocations).sort((a, b) =>
        dataByLocations[a].length < dataByLocations[b].length ? 1 : -1
      );
      let popularCountryNames = sortingCountryNames.slice(0, 5);
      let otherCountryNames = sortingCountryNames.slice(5, locationCount);
      popularCountryNames.map((name) => {
        chartData.push({
          label: name,
          count: dataByLocations[name].length,
        });
        return chartData;
      });
      if (otherCountryNames.length > 0) {
        let othersCount = 0;
        otherCountryNames.map((name) => {
          othersCount += dataByLocations[name].length;
          return othersCount;
        });
        chartData.push({
          label: "Other countries",
          count: othersCount,
        });
      }
    } else {
      Object.keys(dataByLocations).map((name) => {
        chartData.push({
          label: name,
          count: dataByLocations[name].length,
        });
        return chartData;
      });
    }
    if (chartData && chartData.length > 0) {
      chartData = chartData.sort((a, b) => (a.data < b.data ? 1 : -1));
      let chartValues = [];
      chartData.map((item) => {
        chartLabels.push(item.label);
        chartValues.push(item.count);
        return { chartLabels, chartValues };
      });
      result = { labels: chartLabels, values: chartValues };
    }
  }
  return result;
};

const PieChart = () => {
  const [userData, setUserData] = useState({
    data: { datasets: [], labels: [] },
  });
  useEffect(() => {
    getRandomUserData().then((results) => {
      const mapUserData = getMappedUserData(results.data.results);
      setUserData(getChartData(mapUserData) ?? []);
    });
  }, []);
  let chartInstance = null;

  return (
    <>
      <div>
        <div
          style={{
            height: "auto",
            width: "100%",
            maxWidth: 600,
            margin: "0 auto",
            cursor: "pointer",
          }}
        >
          <Pie
            data={userData}
            ref={(input) => {
              chartInstance = input;
            }}
            options={pieOptions}
          />
        </div>
      </div>
    </>
  );
};

export default PieChart;
