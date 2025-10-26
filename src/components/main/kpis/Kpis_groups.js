import { initChart_FuelVSKm } from "../../UI/Highchart/Highchart.FuelVSKm.js";
import { initChart_Performance } from "../../UI/Highchart/Highchart.performance.js";

export const createKpisGroup = () => {
  return `
        <!-- SECCIÓN KPI DASHBOARD -->
        <div class="row" id="root-card-kpis">
            <center>
              <div id="loading_kpis" class="p-5">
                <img src="./src/assets/img/logojd.png" alt="Cargando..." /><br>
                <h1 class="text-dark">Cargando informacion...</h1>
              </div>
            </center>

            <div class="col-12" id="root_kpis">
                <div class="card shadow-sm border-0 rounded-4 bg-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="fw-bold text-dark mb-0">
                                <i class="bi bi-graph-up-arrow me-2"></i> Indicadores de desempeño
                            </h4>
                            <small class="text-muted fst-italic">Resumen de los ultimos 7 dias.</small>
                        </div>

                        <!-- FILA 1: KPIs numéricos -->
                        <div class="row g-3 mb-4 text-center">
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Rendimiento promedio</h6>
                                        <h2 class="fw-bold text-success mb-0" id="kpi-rendimiento">0 km/L</h2>
                                        <small class="text-muted">Meta: 4.5 km/L</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Consumo total</h6>
                                        <h2 class="fw-bold text-primary mb-0" id="kpi-consumo">0 L</h2>
                                        <small class="text-muted">Últimos 7 días</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Velocidad promedio</h6>
                                        <h2 class="fw-bold text-warning mb-0" id="kpi-velocidad">0 km/h</h2>
                                        <small class="text-muted">Rango ideal: 30-45 km/h</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase">Maxima velocidad detectada</h6>
                                        <h2 class="fw-bold text-danger mb-0" id="kpi-excesos">0</h2>
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
                                        <!-- <h6 class="fw-bold text-muted text-uppercase mb-2">Consumo Total de Combustible</h6>-->
                                        <div id="chart-combustible" style="height:200px;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">

                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Litros consumidos en ralenti</h6>
                                        <h2 class="fw-bold text-danger mb-0" id="kpi-consumo-ralenti">0</h2>
                                        
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Horas en ralenti</h6>
                                        <h2 class="fw-bold text-danger mb-0" id="kpi-consumo-tiempo_ralenti">0</h2>

                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Litros consumidos en movimiento</h6>
                                        <h2 class="fw-bold text-success mb-0" id="kpi-consumo-movimiento">0</h2>
                                        
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Horas en movimiento</h6>
                                        <h2 class="fw-bold text-success mb-0" id="kpi-consumo-tiempo_movimiento">0</h2>
                                        
                                        <!--<div id="chart-excesos" style="height:200px;"></div>-->
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FILA 3: Porcentajes y progreso -->
                        <!-- <div class="row g-3 mt-4">
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
                        -->

                    </div>
                </div>
            </div>
        </div>
    `;
};

export const updateKpis = ( data ) => {
  document.getElementById("kpi-rendimiento").textContent = data?.["Rendimiento"] ?? 'No data 👾';

  document.getElementById("kpi-consumo").textContent = data?.["Combustible consumido"] ?? 'No data 👾';

  document.getElementById("kpi-velocidad").textContent = data?.["Velocidad Promedio"] ?? 'No data 👾';

  document.getElementById("kpi-excesos").textContent = data?.["Velocidad máxima"] ?? 'No data 👾';

  document.getElementById("kpi-consumo-ralenti").textContent = data?.["Consumido en ralentí"] ?? 'No data 👾';

  document.getElementById("kpi-consumo-tiempo_ralenti").textContent = data?.["Ralentí"] ?? 'No data 👾';

  document.getElementById("kpi-consumo-movimiento").textContent = data?.["Consumido en movimiento"] ?? 'No data 👾';

  document.getElementById("kpi-consumo-tiempo_movimiento").textContent = data?.["En movimiento"] ?? 'No data 👾';

    initChart_Performance( parseFloat( data?.["Rendimiento"].toString().replace(',', '.') ) );
    initChart_FuelVSKm( 
      Math.round( parseFloat( data?.["Kilometraje"].toString().replace(',', '.') ) ), 
      Math.round( parseFloat( data?.["Combustible consumido"].toString().replace(',', '.') ) ) 
    );

    $("#loading_kpis").fadeOut()
    $("#root_kpis").removeClass('visually-hidden')

    // const meta_rendimiento = 20;
    // const porcentaje_meta = Math.min(
    //   (promedios?.["RENDIMIENTO DE UNIDAD"].toFixed(2) / meta_rendimiento) * 100,
    //   100
    // );

    //  const progressBar = document.getElementById("progress-rendimiento");
    // progressBar.style.width = `${porcentaje_meta.toFixed(0)}%`;
    // progressBar.textContent = `${porcentaje_meta.toFixed(0)}%`;

    // // Color dinámico según cumplimiento
    // if (porcentaje_meta < 60)
    //   progressBar.className = "progress-bar bg-danger";
    // else if (porcentaje_meta < 90)
    //   progressBar.className = "progress-bar bg-warning";
    // else progressBar.className = "progress-bar bg-success";

  // return { totales, promedios };
}