export const initCharFuel = ( ralenti, movimiento ) =>{
    Highcharts.chart('root-fuel', {
    chart: {
        type: 'bar'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['Combustible.'],
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Resumen de litros consumidos.',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    tooltip: {
        valueSuffix: ' Litros'
    },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [
        { 
            name: 'Ralenti',
            data: [ralenti],
            color: '#dc3545',
        },
        {
            name: 'Movimiento',
            data: [movimiento],
            color: '#198754'
        },
    ]
});
}