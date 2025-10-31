import { initCharFuel } from "../../UI/Highchart/Highchart.Fuel.js";
import { ejecutarReporteGrupal } from "../../../wialon/utils/getReports.js";
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

            <div id="root-reloader-kpis" class="visually-hidden">
                <button class="btn btn-primary" type="button" onclick="execReport(7)">Recargar</button>
            </div>

            <div class="col-12" id="root_kpis">
                <div class="card shadow-sm border-0 rounded-4 bg-white">
                    <div class="card-body">

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="fw-bold text-dark mb-0">
                                <i class="bi bi-graph-up-arrow me-2"></i>
                                Indicadores de desempeño <span id="root_group_kpis"></span>
                            </h4>

                            <div class="btn-group" role="group" aria-label="Rango de fechas">
                                <input type="radio" class="btn-check" name="range" id="week" autocomplete="off" checked>
                                <label class="btn btn-outline-primary" for="week" onclick="execReport(7)">Últimos 7 días</label>

                                <input type="radio" class="btn-check" name="range" id="month" autocomplete="off">
                                <label class="btn btn-outline-primary" for="month" onclick="execReport(30)">Último mes</label>
                            </div>

                            <small class="text-muted fst-italic">Resumen de los últimos 7 días.</small>
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
                                        <h6 class="fw-bold text-muted text-uppercase">Máxima velocidad detectada</h6>
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
                                        <div id="chart-rendimiento" style="height:100%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <div id="chart-combustible" style="height:100%;"></div>
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

                                        <div id="root-fuel" style="height:200px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- /FILA 2 -->

                    </div> <!-- /card-body -->
                </div> <!-- /card -->
            </div> <!-- /col-12 -->

        </div> <!-- /row -->
    `;
};

export const updateKpis = ( group, data ) => {
    document.getElementById("root_group_kpis").textContent = group;
    
    document.getElementById("kpi-rendimiento").textContent = data?.["Rendimiento"] ?? 'No data 👾';

    document.getElementById("kpi-consumo").textContent = data?.["Combustible consumido"] ?? 'No data 👾';

    document.getElementById("kpi-velocidad").textContent = data?.["Velocidad Promedio"] ?? 'No data 👾';

    document.getElementById("kpi-excesos").textContent = data?.["Velocidad máxima"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-ralenti").textContent = data?.["Consumido en ralentí"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-tiempo_ralenti").textContent = data?.["Ralentí"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-movimiento").textContent = data?.["Consumido en movimiento"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-tiempo_movimiento").textContent = data?.["En movimiento"] ?? 'No data 👾';

    initChart_Performance( parseFloat( data?.["Rendimiento"].toString().replace(',', '.') ) );
    initCharFuel( 
        Math.round( parseFloat( data?.["Consumido en ralentí"].toString().replace(',', '.') ) ),
        Math.round( parseFloat( data?.["Consumido en movimiento"].toString().replace(',', '.') ) ) 
    );
    initChart_FuelVSKm( 
        Math.round( parseFloat( data?.["Kilometraje"].toString().replace(',', '.') ) ), 
        Math.round( parseFloat( data?.["Combustible consumido"].toString().replace(',', '.') ) ) 
    );

    $("#loading_kpis").fadeOut()
    $("#root-reloader_kpis").addClass('visually-hidden')
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

export const getReloader = () =>{
    $("#loading_kpis").fadeOut();
    $("#root-reloader-kpis").removeClass('visually-hidden');
    $("#root_kpis").addClass('visually-hidden');
}

export const execReport = ( days ) => {
    $("#loading_kpis").fadeIn();
    $("#root_kpis").addClass('visually-hidden');
    $("#root-reloader-kpis").addClass('visually-hidden');
    ejecutarReporteGrupal( "Z COMBUSTIBLE POR GRUPO GAFI", sessionStorage.getItem("group_select"), days );
}