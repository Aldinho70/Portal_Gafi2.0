import { clearHTML } from '../../utils/utils.js';
import { execReport } from './kpis/Kpis_groups.js';
import { createLoader } from '../UI/Loader/Loader.js';
import { CreateNavTabGroups } from './Groups/Groups.js';
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
      <div class="row" id="root-card-groups"> ${CreateNavTabGroups()} </div>

      <!-- ======= Tabs Navigation ======= -->
      <div class="">
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
                <button class="nav-link fw-semibold px-4 py-2 shadow-sm visually-hidden"
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
<div class="col-xxl-4 col-xl-6" id="card-${unit.id_unidad}">
  <div class="card border-0 rounded-4 shadow bg-body h-100">

    <!-- HEADER -->
    <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-3">
        <img src="${unit.icon}" width="44" height="44"
          class="rounded-circle border border-secondary-subtle">
        <div>
          <div class="fw-bold">${unit.name}</div>
          <small class="text-muted">Unidad de transporte</small>
        </div>
      </div>

      <div class="text-end">
        <span class="badge bg-success-subtle text-success px-3 py-2">
          <i class="bi bi-check-circle-fill me-1"></i> Operando
        </span>
      </div>
    </div>

    <!-- BODY -->
    <div class="card-body p-4">

      <!-- CONTEXTO -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <small class="text-muted">
          <i class="bi bi-calendar-week me-1"></i> Últimos 7 días
        </small>
        <small class="text-muted fst-italic">
          Actualización automática
        </small>
      </div>

      <!-- BLOQUE PRINCIPAL -->
      <div class="row g-3 mb-4">

        <!-- KPI GRANDE -->
        <div class="col-12">
          <div class="p-4 rounded-4 bg-body-tertiary text-center">
            <div class="text-muted small mb-1">Eficiencia general</div>
            <div class="display-5 fw-bold text-success" id="cont-porcent">0%</div>
            <small class="text-muted">Basado en rendimiento promedio</small>
          </div>
        </div>

        <!-- KPIs SECUNDARIOS -->
        <div class="col-6">
          <div class="p-3 rounded-3 bg-body-tertiary">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Km recorridos</small>
                <div class="fw-bold fs-5 km">--</div>
              </div>
              <i class="bi bi-sign-merge-left fs-3 text-primary"></i>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="p-3 rounded-3 bg-body-tertiary">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Combustible</small>
                <div class="fw-bold fs-5 combustible">--</div>
              </div>
              <i class="bi bi-fuel-pump-diesel-fill fs-3 text-success"></i>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="p-3 rounded-3 bg-body-tertiary">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Rendimiento</small>
                <div class="fw-bold fs-5 rendimiento">--</div>
              </div>
              <i class="bi bi-calculator fs-3 text-info"></i>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div class="p-3 rounded-3 bg-body-tertiary">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted">Vel. Máx</small>
                <div class="fw-bold fs-5 excesos">--</div>
              </div>
              <i class="bi bi-speedometer2 fs-3 text-warning"></i>
            </div>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <small class="text-muted">
          <i class="bi bi-info-circle me-1"></i>
          Datos telemétricos consolidados
        </small>

        <button class="btn btn-outline-primary btn-sm fw-semibold"
          onClick="createSidebarDetailBody('${unit.id_unidad}')"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight">
          <i class="bi bi-bar-chart-line me-1"></i> Análisis
        </button>
      </div>

    </div>
  </div>
</div>
`);

  });
};