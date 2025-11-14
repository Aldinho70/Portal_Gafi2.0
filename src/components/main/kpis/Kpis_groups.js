import { fetchReporte } from "../../../api/reports/getReports.js";
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

            <div id="root-reloader-kpis" class="visually-hidden d-flex flex-column justify-content-center align-items-center text-center p-5" style="min-height: 300px;">
                <h4 class="text-danger fw-bold mb-3">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Ocurrió un error al cargar la información
                </h4>
                <p class="text-muted mb-4">Intenta nuevamente.</p>
                <button class="btn btn-primary px-4" type="button" onclick="execReport(7)">
                    <i class="bi bi-arrow-repeat me-2"></i>Recargar
                </button>
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
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100 
                                            cursor-pointer transition" 
                                    style="transition: .2s ease;">

                                    <div class="card-body" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modal-round-fuel"
                                        onmouseover="this.parentElement.style.transform='scale(1.03)'; this.parentElement.classList.add('shadow');"
                                        onmouseout="this.parentElement.style.transform='scale(1)'; this.parentElement.classList.remove('shadow');">

                                        <h6 class="fw-bold text-muted text-uppercase">Rendimiento promedio</h6>
                                        <h2 class="fw-bold text-success mb-0" id="kpi-rendimiento">0 km/L</h2>
                                        <small class="text-muted">Meta: 4.5 km/L</small>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="card border-0 shadow-sm bg-light rounded-3 h-100 
                                            cursor-pointer transition" 
                                    style="transition: .2s ease;">

                                    <div class="card-body" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modal-limit-speed"
                                        onmouseover="this.parentElement.style.transform='scale(1.03)'; this.parentElement.classList.add('shadow');"
                                        onmouseout="this.parentElement.style.transform='scale(1)'; this.parentElement.classList.remove('shadow');">

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
                            <!--<div class="col-md-4">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-muted text-uppercase mb-2">Rendimiento Promedio</h6>
                                        <div id="chart-rendimiento" style="height:100%;"></div>
                                    </div>
                                </div>
                            </div>-->

                            <div class="col-md-6">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <!-- <div class="d-flex flex-row gap-1 justify-content-between">
                                            <div class="" id="root-list-unit-limit-speed"></div>

                                            <div class="" id="root-list-unit-round-fuel"></div>
                                        </div> -->
                                        <div id="chart-combustible" style="height:100%;"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="card text-center shadow-sm border-0 rounded-3 bg-light h-100">
                                    <div class="card-body">
                                        <h5 class="fw-bold text-secondary text-uppercase mb-3">Consumo y Tiempo</h5>

                                        <div class="row g-3 mb-3">
                                            <!-- KPI 1 -->
                                            <div class="col-6">
                                                <div class="p-3 bg-white rounded-3 shadow-sm">
                                                    <h6 class="fw-semibold text-muted text-uppercase mb-1">Litros Ralenti</h6>
                                                    <h3 class="fw-bold text-danger mb-0" id="kpi-consumo-ralenti">0</h3>
                                                </div>
                                            </div>
                                            <!-- KPI 2 -->
                                            <div class="col-6">
                                                <div class="p-3 bg-white rounded-3 shadow-sm">
                                                    <h6 class="fw-semibold text-muted text-uppercase mb-1">Horas Ralenti</h6>
                                                    <h3 class="fw-bold text-danger mb-0" id="kpi-consumo-tiempo_ralenti">0</h3>
                                                </div>
                                            </div>
                                            <!-- KPI 3 -->
                                            <div class="col-6">
                                                <div class="p-3 bg-white rounded-3 shadow-sm">
                                                    <h6 class="fw-semibold text-muted text-uppercase mb-1">Litros Movimiento</h6>
                                                    <h3 class="fw-bold text-success mb-0" id="kpi-consumo-movimiento">0</h3>
                                                </div>
                                            </div>
                                            <!-- KPI 4 -->
                                            <div class="col-6">
                                                <div class="p-3 bg-white rounded-3 shadow-sm">
                                                    <h6 class="fw-semibold text-muted text-uppercase mb-1">Horas Movimiento</h6>
                                                    <h3 class="fw-bold text-success mb-0" id="kpi-consumo-tiempo_movimiento">0</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Gráfica -->
                                        <div id="root-fuel" class="mt-3" style="height:220px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </div> 
            </div> 
        </div> 
    `;
};

export const updateKpis = async (group, data) => {
    document.getElementById("root_group_kpis").textContent = group;

    document.getElementById("kpi-rendimiento").textContent = data?.["Rendimiento"] ?? 'No data 👾';

    document.getElementById("kpi-consumo").textContent = data?.["Combustible consumido"] ?? 'No data 👾';

    document.getElementById("kpi-velocidad").textContent = data?.["Velocidad Promedio"] ?? 'No data 👾';

    document.getElementById("kpi-excesos").textContent = data?.["Velocidad máxima"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-ralenti").textContent = data?.["Consumido por FLS en ralentí"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-tiempo_ralenti").textContent = data?.["Ralentí"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-movimiento").textContent = data?.["Consumido en movimiento"] ?? 'No data 👾';

    document.getElementById("kpi-consumo-tiempo_movimiento").textContent = data?.["En movimiento"] ?? 'No data 👾';

    // initChart_Performance( parseFloat( data?.["Rendimiento"].toString().replace(',', '.') ) );
    initCharFuel(
        Math.round(parseFloat(data?.["Consumido por FLS en ralentí"].toString().replace(',', '.'))),
        Math.round(parseFloat(data?.["Consumido en movimiento"].toString().replace(',', '.')))
    );
    
    initChart_FuelVSKm(
        Math.round(parseFloat(data?.["Kilometraje"].toString().replace(',', '.'))),
        Math.round(parseFloat(data?.["Combustible consumido"].toString().replace(',', '.')))
    );

    $("#loading_kpis").fadeOut()
    $("#root-reloader_kpis").addClass('visually-hidden')
    $("#root_kpis").removeClass('visually-hidden')


    // $( "#root-list-unit-limit-speed" ).html( await getLimitSpeed( '2025-10-01', '2025-11-01', 29566197 ) )
    // $( "#root-list-unit-round-fuel" ).html( await getRoundFuel() )

    // $( "#root-list-unit-limit-speed" ).html( await getRoundFuel() )

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

export const getReloader = () => {
    $("#loading_kpis").fadeOut();
    $("#root-reloader-kpis").removeClass('visually-hidden');
    $("#root_kpis").addClass('visually-hidden');
}

export const execReport = (days, from, to) => {
    $("#loading_kpis").fadeIn();
    $("#root_kpis").addClass('visually-hidden');
    $("#root-reloader-kpis").addClass('visually-hidden');
    if( days == 0 ){
        ejecutarReporteGrupal("Z COMBUSTIBLE POR GRUPO GAFI", "Horas de Motor", sessionStorage.getItem("group_select"), 0, from, to );
    }else{
        ejecutarReporteGrupal("Z COMBUSTIBLE POR GRUPO GAFI", "Horas de Motor", sessionStorage.getItem("group_select"), days );
    }
}

export const getLimitSpeed = async ( from, to, id_group ) => {
  const data = await fetchReporte( from, to, id_group, 'speed/getLimitSpeed.php');

  if (!data?.rows) return null;

  console.log(data.rows);
  
  const html = data.rows.map(element => `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${element.unidad}</div>
        Velocidad registrada: ${element.exceso_velocidad.registrado}
      </div>
      <span class="badge text-bg-primary rounded-pill">${element.exceso_velocidad.veces}</span>
    </li>
  `).join('');

  $("#root-modal-body-limit-speed").html( `<ol class="list-group list-group-numbered">${html}</ol>` );
};

export const getRoundFuel = async (from, to, id_group) => {
    const data = await fetchReporte( from, to, id_group, 'fuel/getRoundFuel.php');

    if (!data?.rows) return null;

    console.log( data.rows );
    
    const html = data.rows
    .filter(e => e.rendimiento && e.rendimiento.trim() !== "")
    .map(element => `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${element.unidad}</div>
            </div>
            <span class="badge text-bg-primary rounded-pill">${element.rendimiento}</span>
        </li>
    `)
    .join('');

    $("#root-modal-body-round-fuel").html(`<ol class="list-group list-group-numbered">${html}</ol>`);
}