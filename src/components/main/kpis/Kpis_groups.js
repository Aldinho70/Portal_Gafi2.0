export const createKpisGroup = () => {
    return `
        <!-- SECCIÓN KPI DASHBOARD -->
        <div class="row gy-4 mb-4" id="root-card-kpis">
            <div class="col-12">
                <div class="card shadow-sm border-0 rounded-4 bg-white">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="fw-bold text-primary mb-0">
                                <i class="bi bi-graph-up-arrow me-2"></i> Indicadores de desempeño
                            </h4>
                            <small class="text-muted fst-italic">Actualizado cada 24h</small>
                        </div>

                        <!-- FILA 1: KPIs numéricos -->
                        <div class="row g-3 mb-4 text-center">
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Rendimiento promedio</h6>
                                        <h2 class="fw-bold text-success mb-0" id="kpi-rendimiento">3.8 km/L</h2>
                                        <small class="text-muted">Meta: 4.5 km/L</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Consumo total</h6>
                                        <h2 class="fw-bold text-primary mb-0" id="kpi-consumo">8450 L</h2>
                                        <small class="text-muted">Últimos 7 días</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Velocidad promedio</h6>
                                        <h2 class="fw-bold text-warning mb-0" id="kpi-velocidad">68 km/h</h2>
                                        <small class="text-muted">Rango ideal: 60-75 km/h</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Excesos detectados</h6>
                                        <h2 class="fw-bold text-danger mb-0" id="kpi-excesos">14</h2>
                                        <small class="text-muted">Semana actual</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FILA 2: GRÁFICAS -->
                        <div class="row g-4">
                            <div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Rendimiento Promedio</h6>
                                        <div id="chart-rendimiento" style="height:200px;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Consumo Total de Combustible</h6>
                                        <div id="chart-combustible" style="height:200px;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Excesos de Velocidad</h6>
                                        <div id="chart-excesos" style="height:200px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FILA 3: Porcentajes y progreso -->
                        <div class="row g-3 mt-4">
                            <div class="col-md-6">
                                <div class="card border-0 shadow-sm bg-light rounded-3">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-3">Cumplimiento de meta de rendimiento</h6>
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-success" id="progress-rendimiento" style="width: 75%;">75%</div>
                                        </div>
                                        <small class="text-muted">Objetivo: mejorar al menos un 10% mensual</small>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card border-0 shadow-sm bg-light rounded-3">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-3">Tendencia general de consumo</h6>
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-arrow-up-right-circle-fill text-success fs-3 me-3"></i>
                                            <div>
                                                <h5 class="fw-bold mb-0 text-success">+4.8%</h5>
                                                <small class="text-muted">vs semana anterior</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export const initCharts = () => {
    Highcharts.chart('chart-rendimiento', {
        chart: { type: 'gauge', backgroundColor: 'transparent' },
        title: { text: '' },
        pane: { startAngle: -150, endAngle: 150 },
        yAxis: {
            min: 0, max: 6, title: { text: 'km/L' },
            plotBands: [
                { from: 0, to: 2, color: '#dc3545' },
                { from: 2, to: 4, color: '#ffc107' },
                { from: 4, to: 6, color: '#28a745' }
            ]
        },
        series: [{ name: 'Rendimiento', data: [3.5], tooltip: { valueSuffix: ' km/L' } }]
    });

    Highcharts.chart('chart-combustible', {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: '' },
        xAxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
        yAxis: { title: { text: 'Litros' } },
        series: [{ name: 'Consumo', data: [120, 135, 150, 160, 180, 170, 155], color: '#007bff' }]
    });

    Highcharts.chart('chart-excesos', {
        chart: { type: 'pie', backgroundColor: 'transparent' },
        title: { text: '' },
        plotOptions: { pie: { dataLabels: { enabled: true, format: '{point.name}: {point.y}' } } },
        series: [{
            name: 'Eventos',
            data: [
                { name: 'Dentro del límite', y: 85, color: '#28a745' },
                { name: 'Excesos', y: 15, color: '#dc3545' }
            ]
        }]
    });
}