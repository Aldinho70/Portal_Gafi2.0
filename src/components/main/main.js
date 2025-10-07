import { clearHTML } from '../../utils/utils.js';
import { createLoader } from '../UI/Loader/Loader.js';
import { getFechaActual } from '../../utils/timestamp.js'
import { createTimedata } from '../UI/Timedata/Timedata.js';
import { createModalNotification } from './Notifications.js';

$(document).ready(function () {
  $('#mainContent').html(`
    <div class="container-fluid py-3 px-4">
      ${ createLoader() }
      ${ createTimedata() }  

      <div class="row g-3 mb-4" id="root-card-groups"></div>
      <hr class="border border-dark border-3 opacity-75"/>

      <div class="container-fluid px-0" id="root-main-1" style="max-height: 75vh; overflow-y: auto">

      <!-- Categorías -->
      <!-- <div class="row gy-4" id="root-card-info"></div>
      <hr class="border border-primary border-3 opacity-75"/> -->

      <!-- TODAS LAS UNIDADES -->
      <div class="row row-cols-1 row-cols-md-3 g-4" id="root-card" ></div>

      </div>
    </div>
    ${ createModalNotification() }
    <div class="modal" tabindex="-1" id="unitDetailModal"></div> 
  `);
  
  $("#loading").fadeIn();
});


export const htmlCreateCard = (data) => {
  clearHTML("#root-card");

  data.map(unit => {
    $('#root-card').append(`
  <div class="col" id="card-${unit.id_unidad}">
    <div class="card shadow-lg border-0 rounded-4 bg-white overflow-hidden">
      <div class="card-body p-4">

        <!-- ENCABEZADO -->
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div class="d-flex align-items-center">
            <img src="${unit.icon}" alt="Logo" width="45" height="45" class="me-2 rounded-circle border">
            <div>
              <h5 class="mb-0 fw-bold text-dark">${unit.name}</h5>
              <small class="text-muted">Unidad de transporte</small>
            </div>
          </div>
          <button type="button" class="btn btn-outline-warning  fw-semibold"
            onClick="createSidebarDetailBody('${unit.id_unidad}')"
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight">
            <i class="bi bi-info-circle me-1"></i> Ver mas detalles
          </button>
        </div>

        <!-- SECCIÓN: DATOS GENERALES -->
        <div class="mb-3">
          <h6 class="text-uppercase text-muted fw-bold border-start border-3 ps-2 mb-2">
            Resumen de actividad
          </h6>
          <p class="text-muted small mb-0 d-flex align-items-center">
            <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
            <span><i class="bi bi-clock me-1"></i> Datos recopilados de los últimos 7 días</span>
          </p>
        </div>

        <!-- SECCIÓN: MÉTRICAS -->
        <div class="row g-3 align-items-stretch">
          <div class="col-md-7">
            <div class="card border-light shadow-sm rounded-3 h-100">
              <div class="card-body">
                <h6 class="text-muted fw-bold text-uppercase border-bottom pb-2 mb-3">
                  Desempeño general
                </h6>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-sign-merge-left me-2 text-primary"></i>Km recorridos:</span>
                    <span class="fw-semibold text-dark km">--</span>
                  </li>
                  <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-fuel-pump-diesel-fill me-2 text-success"></i>Combustible consumido:</span>
                    <span class="fw-semibold text-dark combustible">--</span>
                  </li>
                  <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-calculator me-2 text-info"></i>Rendimiento:</span>
                    <span class="fw-semibold text-dark rendimiento">--</span>
                  </li>
                  <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-speedometer me-2 text-warning"></i>Excesos de velocidad:</span>
                    <span class="fw-semibold text-dark excesos">--</span>
                  </li>
                  <li class="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-bootstrap-reboot me-2 text-danger"></i>Tiempo en ralentí:</span>
                    <span class="fw-semibold text-dark ralenti">0 h</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- SECCIÓN: CALIFICACIÓN -->
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
                <small class="text-muted fst-italic">
                  A mayor porcentaje, mejor eficiencia de combustible.
                </small>
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