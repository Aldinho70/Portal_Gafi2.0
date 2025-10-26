export const initChart_FuelVSKm = ( km, litros ) => {
  Highcharts.chart('chart-combustible', {
  chart: { type: 'bar', backgroundColor: 'transparent' },
  title: { text: 'Comparativa de km recorridos vs combutible consumido' },
  xAxis: {
    categories: ['Totales']
  },
  yAxis: {
    min: 0,
    title: { text: 'Valores Totales' }
  },
  series: [{
    name: 'Km Recorridos',
    data: [km],
    color: '#28a745'
  }, {
    name: 'Combustible Consumido',
    data: [litros],
    color: '#007bff'
  }]
});
}