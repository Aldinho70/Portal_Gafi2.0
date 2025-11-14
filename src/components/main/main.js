import { clearHTML } from '../../utils/utils.js';
import { execReport } from './kpis/Kpis_groups.js';
import { createLoader } from '../UI/Loader/Loader.js';
import { createKpisGroup } from './kpis/Kpis_groups.js';
import { createTimedata } from '../UI/Timedata/Timedata.js';
import { createModalNotification } from './Notifications.js';
import { getLimitSpeed, getRoundFuel } from './kpis/Kpis_groups.js';

$(document).ready(function () {
  $('#mainContent').html(`
    <div class="bg-light min-vh-100">

      ${createLoader()}
      ${createTimedata()}

      <!-- ======= KPIs grupales ======= -->
      <div class="row" id="root-card-groups"></div>

      <!-- ======= Tabs Navigation ======= -->
      <div class="container my-3">
        <div class="row align-items-center gy-3">

          <!-- Buscador -->
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text" id="input-search-units">🔎</span>
              <input type="text" id="searchUnits" class="form-control" placeholder="Buscar unidades..." aria-label="units" aria-describedby="input-search-units">
            </div>
          </div>

          <!-- Rango de fechas -->
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
              <input type="text" id="rangoFechas" class="form-control" placeholder="Selecciona un rango de fechas">
            </div>
          </div>

          <!-- Menú -->
          <div class="col-md-4">
            <ul class="nav nav-pills justify-content-center flex-wrap gap-2" id="menuTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active fw-semibold px-4 py-2 shadow-sm"
                  id="unidades-tab" data-bs-toggle="pill" data-bs-target="#unidades"
                  type="button" role="tab" aria-controls="unidades" aria-selected="false">
                  <i class="bi bi-truck me-2"></i>Todas las Unidades
                </button>
              </li>

              <li class="nav-item" role="presentation">
                <button class="nav-link fw-semibold px-4 py-2 shadow-sm"
                  id="kpis-grupal-tab" data-bs-toggle="pill" data-bs-target="#kpis-grupal"
                  type="button" role="tab" aria-controls="kpis-grupal" aria-selected="true">
                  <i class="bi bi-graph-up me-2"></i>KPIs Grupal
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- ======= Separator ======= -->
      <hr class="border border-dark border-1 opacity-50"/>

      <!-- ======= Main Content ======= -->
      <div class="tab-content" id="menuTabsContent" style="max-height: 75vh; overflow-y: auto;">

        <!-- Panel: KPIs Grupal -->
        <div class="tab-pane fade" id="kpis-grupal" role="tabpanel" aria-labelledby="kpis-grupal-tab">
          ${createKpisGroup()}
        </div>

        <!-- Panel: Unidades -->
        <div class="tab-pane fade show active" id="unidades" role="tabpanel" aria-labelledby="unidades-tab">
          <div class="card border-0 shadow-sm rounded-4 bg-white">
            <div class="row row-cols-sm-2 row-cols-md-3 g-3" id="root-card"></div>
          </div>
        </div>
      </div>

    </div>

    <!-- ======= Modales ======= -->
    ${createModalNotification()}
    <div class="modal fade" tabindex="-1" id="unitDetailModal"></div>
  `);

  // Mostrar loader
  $("#loading").fadeIn();
  $("#root_kpis").addClass('visually-hidden');

  // Inicializar Flatpickr (después de inyectar el HTML)
  flatpickr("#rangoFechas", {
  mode: "range",
  dateFormat: "Y-m-d",
  locale: "es",
    onClose: function(selectedDates) {
      if (selectedDates.length === 2) {
        const inicio = selectedDates[0];
        const fin = selectedDates[1];
        const diffDias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));

        console.log(inicio.toISOString().split('T')[0], fin.toISOString().split('T')[0], sessionStorage.getItem('id_group_select'));

        if( sessionStorage.getItem('id_group_select') ){
          getLimitSpeed( inicio.toISOString().split('T')[0], fin.toISOString().split('T')[0], sessionStorage.getItem('id_group_select') )
          getRoundFuel( inicio.toISOString().split('T')[0], fin.toISOString().split('T')[0], sessionStorage.getItem('id_group_select') )
          execReport( 0, inicio.toISOString().split('T')[0], fin.toISOString().split('T')[0] );
        }
      }
    }
  });

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
                        <span><i class="bi bi-speedometer me-2 text-warning"></i>Velocidad maxima:</span>
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
