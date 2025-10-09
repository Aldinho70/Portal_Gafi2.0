import { clearHTML } from '../../utils/utils.js';
import { createLoader } from '../UI/Loader/Loader.js';
import { getFechaActual } from '../../utils/timestamp.js';
import { createTimedata } from '../UI/Timedata/Timedata.js';
import { createModalNotification } from './Notifications.js';

$(document).ready(function () {
  // 1️⃣ Estructura base
  $('#mainContent').html(`
    <div class="container-fluid py-3 px-4">
      ${createLoader()}
      ${createTimedata()}  

      <div class="row g-3 mb-4" id="root-card-groups"></div>
      <hr class="border border-dark border-3 opacity-75"/>

      <div class="container-fluid px-0" id="root-main-1" style="max-height: 75vh; overflow-y: auto">

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
                  <div class="progress-bar bg-success" id="progress-rendimiento" style="width: 75%;">
                    75%
                  </div>
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


        <hr class="border border-primary border-3 opacity-75"/>

        <!-- TODAS LAS UNIDADES -->
        <div class="row row-cols-1 row-cols-md-3 g-4" id="root-card"></div>
      </div>
    </div>

    ${createModalNotification()}
    <div class="modal" tabindex="-1" id="unitDetailModal"></div>
  `);

  // 2️⃣ Mostrar loader
  $("#loading").fadeIn();

  // 3️⃣ Inicializar las gráficas (KPI Dashboard)
  renderCharts();

  // 4️⃣ Cargar tarjetas con datos
  const unidades = [
    { id_unidad: 1, name: "Tracto 101", icon: "img/truck.png" },
    { id_unidad: 2, name: "Tracto 202", icon: "img/truck.png" }
  ];
  htmlCreateCard(unidades);
});

// =============================
// FUNCIONES
// =============================

/** Crea las gráficas principales */
function renderCharts() {
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

/** Genera las tarjetas de unidades */
export const htmlCreateCard = (data) => {
  clearHTML("#root-card");

  data.forEach(unit => {
    $('#root-card').append(`
      <div class="col" id="card-${unit.id_unidad}">
        <div class="card shadow-lg border-0 rounded-4 bg-white overflow-hidden">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div class="d-flex align-items-center">
                <img src="${unit.icon}" alt="Logo" width="45" height="45" class="me-2 rounded-circle border">
                <div>
                  <h5 class="mb-0 fw-bold text-dark">${unit.name}</h5>
                  <small class="text-muted">Unidad de transporte</small>
                </div>
              </div>
              <button type="button" class="btn btn-outline-warning fw-semibold"
                onClick="createSidebarDetailBody('${unit.id_unidad}')"
                data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight">
                <i class="bi bi-info-circle me-1"></i> Ver más detalles
              </button>
            </div>

            <div class="row g-3 align-items-stretch">
              <div class="col-md-7">
                <div class="card border-light shadow-sm rounded-3 h-100">
                  <div class="card-body">
                    <h6 class="text-muted fw-bold text-uppercase border-bottom pb-2 mb-3">
                      Desempeño general
                    </h6>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <span>Kilómetros recorridos:</span>
                        <span class="fw-semibold text-dark km">--</span>
                      </li>
                      <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <span>Combustible consumido:</span>
                        <span class="fw-semibold text-dark combustible">--</span>
                      </li>
                      <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                        <span>Rendimiento:</span>
                        <span class="fw-semibold text-dark rendimiento">--</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-md-5">
                <div class="card text-center border-0 shadow-sm rounded-3 bg-light h-100">
                  <div class="card-body py-4 d-flex flex-column justify-content-center">
                    <h6 class="text-uppercase text-muted fw-bold border-bottom pb-2 mb-3">
                      Calificación del rendimiento
                    </h6>
                    <h1 class="display-4 fw-bold text-success" id="cont-porcent">0%</h1>
                    <p class="text-secondary small mb-1">
                      Basado en el rendimiento promedio (km/L)
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `);
  });
};
