export const initChart_Performance = ( rendimiento ) => {
  Highcharts.chart("chart-rendimiento", {
    chart: { type: "gauge", backgroundColor: "transparent" },
    title: { text: "" },
    pane: { startAngle: -150, endAngle: 150 },
    yAxis: {
      min: 0,
      max: 20,
      title: { text: "km/L" },
      plotBands: [
        { from: 0, to: 5, color: "#dc3545" },
        { from: 5, to: 10, color: "#ffc107" },
        { from: 10, to: 20, color: "#28a745" },
      ],
    },
    series: [
      { name: "Rendimiento", data: [rendimiento], tooltip: { valueSuffix: " km/L" } },
    ],
  });
}