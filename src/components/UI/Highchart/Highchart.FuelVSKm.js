export const initChart_FuelVSKm = ( km, litros ) => {
  Highcharts.chart('chart-combustible', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Comparativa de Kilómetros Totales vs Litros de Combustible'
    },
    xAxis: {
        categories: ['Total']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Total'
        }
    },
    series: [{
        name: 'Kilómetros Totales',
        data: [km] // Valor de ejemplo
    }, {
        name: 'Litros de Combustible',
        data: [litros] // Valor de ejemplo
    }]
  });
}

// export const initChart_FuelVSKm = ( km, litros ) => {
//   Highcharts.chart('chart-combustible', {
//   chart: { type: 'bar', backgroundColor: 'transparent' },
//   title: { text: 'Comparativa de km recorridos vs combutible consumido' },
//   xAxis: {
//     categories: ['Totales']
//   },
//   yAxis: {
//     min: 0,
//     title: { text: 'Valores Totales' }
//   },
//   series: [{
//     name: 'Km Recorridos',
//     data: [km],
//     color: '#28a745'
//   }, {
//     name: 'Combustible Consumido',
//     data: [litros],
//     color: '#007bff'
//   }]
// });
// }