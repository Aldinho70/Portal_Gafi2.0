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
    // console.log(unit);
    // const combustible = unit.sensors.find(s => s.nombre === "COMBUSTIBLE DASHBOARD") ? unit.sensors.find(s => s.nombre === "COMBUSTIBLE DASHBOARD") : 'Error de sensor';
    // const ignicion = unit.sensors.find(s => s.nombre === "IGNICION") ? unit.sensors.find(s => s.nombre === "IGNICION") : 'N/A';
    // const voltaje = unit.sensors.find(s => s.nombre === "VOLTAJE EXTERNO");
    // const odometro = unit.sensors.find(s => s.nombre === "ODOMETRO") ?? 'error de sensor';

    $('#root-card').append(`
      <!-- Tarjeta  -->
          <div class="col">
            <div class="card shadow-lg border-0 rounded-4 bg-light">
              <div class="card-body">
                <h5 class="card-title fw-bold fs-5 text-dark mb-2">
                  <div class="d-flex justify-content-between" >
                    <a class="navbar-brand" href="#">
                      <img src="${unit.icon}" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
                      ${unit.name}
                    </a>
                    <button type="button" class="btn btn-warning btn-lg" onClick="(createSidebarDetailBody('${unit.id_unidad}'))" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Ver mas detalles</button>
                  </div>
                </h5>
                <p class="text-muted small mb-3">
                  <i class="bi bi-clock me-1"></i> Calculos de los ultimos 7 dias.
                </p>
                <div class="row">
                  <div class="col-7">
                    <ul class="list-group list-group-flush">

                    <!-- km recorridos -->
                      <li class="list-group-item d-flex justify-content-between align-items-center border-start border-4 rounded-start">
                        <span><i class="bi bi-sign-merge-left me-2"></i>km recorridos:</span>
                        <span class="fw-semibold text-danger">${ unit.data?.km_recorridos ?? 0 } km.</span>
                      </li>
                    <!-- km recorridos -->

                    <!-- combustible consumido -->
                      <li class="list-group-item d-flex justify-content-between align-items-center border-start border-4 rounded-start">
                        <span><i class="bi bi-fuel-pump-diesel-fill me-2"></i>Combustible consumido:</span>
                        <span class="fw-semibold text-success">${ unit.data?.combustible_utilizado ?? 0 } litros.</span>
                      </li>
                    <!-- combustible consumido -->

                    <!-- Rendimiento -->
                      <li class="list-group-item d-flex justify-content-between align-items-center border-start border-4 rounded-start">
                        <span><i class="bi bi-calculator me-2"></i>Rendimiento:</span>
                        <span class="fw-semibold text-danger">${ unit.data?.rendimiento ?? 0 } km/h.</span>
                      </li>
                    <!-- Rendimiento -->
                      
                    <!-- Exceso de velocidad -->
                      <li class="list-group-item d-flex justify-content-between align-items-center border-start border-4 rounded-start">
                        <span><i class="bi bi-speedometer me-2"></i>Excesos de velocidad:</span>
                        <span class="fw-semibold text-danger">${ unit.data?.excesos_de_velocidad ?? 0 } ocasiones</span>
                      </li>
                    <!-- Rendimiento -->

                    </ul>
                  </div>
                  <div class="col-5">
                    <div class="card text-center shadow-lg border-0 rounded-4">
                      <div class="card-body">
                        <h5 class="card-title text-muted fw-semibold">Estado de la unidad</h5>
                        <h1 class="display-3 text-success fw-bold" id="cont-porcent">94%</h1>
                        <p class="card-text text-secondary">calificacion segun su rendimiento</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
      <!-- Repetir dinámicamente -->`);
  })
}

// export const htmListCard = (data, name, total = 0) => {
//   clearHTML("#root-list-card");
//   $('#root-card').addClass('d-none')
//   $('#root-main-2').removeClass('d-none')
//   $('.btn-card-categori').removeClass('bg-warning')
//   $(`#root_card_${name}`).addClass('bg-warning'); 
//   $('#root-categori').html(`${name.charAt(0).toUpperCase() + name.slice(1)}: ${total} unidades.`)

//   let index = 0;
//   sessionStorage.setItem('card_actived', name);

//   for (const key in data) {
//     if (Object.prototype.hasOwnProperty.call(data, key)) {
//       const unit = data[key];

//       const combustible = (unit.sensors.find(s => s.nombre === "GABINETE")) ? unit.sensors.find(s => s.nombre === "GABINETE") : 0;
//       const ignicion = (unit.sensors.find(s => s.nombre === "IGNICION")) ? unit.sensors.find(s => s.nombre === "IGNICION") : 0;
//       const voltaje = (unit.sensors.find(s => s.nombre === "VOLTAJE EXTERNO")) ? unit.sensors.find(s => s.nombre === "VOLTAJE EXTERNO") : 0;

//       const estadoIcon = (ignicion.valor == 1) ? `toggle-on text-success` : `toggle-off text-danger`;
//       const gabineteIcon = (combustible.valor != 1) ? `lock-fill text-danger` : `unlock-fill text-success`;
//       const voltajeIcon = (voltaje.valor != 'N/A') ? `battery-charging text-warning` : `battery text-danger`;
//       const estado = (ignicion.valor == 1) ? 'encendido' : 'apagado'

//       $('#root-list-card').append(`
//         <div class="accordion-item border rounded-4 shadow-sm mb-3">
//           <h2 class="accordion-header" id="heading-${index}">
//             <button class="accordion-button collapsed d-flex justify-content-between align-items-center rounded-top-4"
//                     type="button"
//                     id="button-accordion-${index}"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#collapse-${index}"
//                     onClick="getMessagesbyId('${unit.id_unidad}', ${index})"
//                     aria-expanded="false"
//                     aria-controls="collapse-${index}">
//               <div class="d-flex flex-column flex-md-row w-100 justify-content-between align-items-center gap-2">
//                 <div class="d-flex align-items-center gap-2">
//                   <img src="${unit.icon}" class="img-thumbnail" style="width: 32px; height: 32px;" alt="Icono">
//                   <span class="fw-semibold text-dark">${unit.name}</span>
//                 </div>
//                 <div class="d-flex align-items-center gap-2">
//                   <i class="bi bi-${estadoIcon} fs-5"></i>
//                   <i class="bi bi-${gabineteIcon} fs-5"></i>
//                   <i class="bi bi-${voltajeIcon} fs-5"></i>
//                 </div>
//               </div>
//             </button>
//           </h2>
//           <div id="collapse-${index}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#root-card">
//             <div class="accordion-body bg-light-subtle rounded-bottom-4 px-3 py-3">

//               <div class="row g-3">
//                 <!-- Columna 1: Info -->
//                 <div class="col-md-4" id="root-column-info-${index}">
//                   <ul class="list-group list-group-flush">
//                     <li class="list-group-item">
//                       <small class="text-muted d-block"><i class="bi bi-clock me-1"></i> Último mensaje:</small>
//                       <strong>${unit.dateParsed}</strong>
//                     </li>

//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <span><i class="bi bi-clock me-1"></i> Tiempo encendido:</span>
//                         <span class="fw-semibold text-success" id="${unit.id_unidad}-encendido"></span>
//                       </div>
//                     </li>

//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <span><i class="bi bi-clock me-1"></i> Tiempo apagado:</span>
//                         <span class="fw-semibold text-danger" id="${unit.id_unidad}-apagado"></span>
//                       </div>
//                     </li>

//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <span><i class="bi bi-${estadoIcon} me-1"></i> Estado:</span>
//                         <span class="fw-semibold text-${ignicion.valor == 1 ? 'success' : 'danger'}">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
//                       </div>
//                     </li>

//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <span><i class="bi bi-${gabineteIcon} me-1"></i> Gabinete:</span>
//                         <span class="fw-semibold text-${(combustible.valor != 1) ? 'danger' : 'success'}">
//                           ${(combustible.valor == 'N/A') ? 'Cerrado' : (combustible.valor == 0 ? 'Cerrado' : 'Abierto')}
//                         </span>
//                       </div>
//                     </li>

//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <span><i class="bi bi-${voltajeIcon} me-1"></i> Voltaje:</span>
//                         <span class="fw-semibold text-${(voltaje.valor === 'N/A') ? 'danger' : 'warning'}">
//                           ${voltaje.valor}
//                         </span>
//                       </div>
//                     </li>
//                     <li class="list-group-item">
//                       <div class="d-flex justify-content-between">
//                         <button type="button" class="btn btn-warning w-100" onClick="getDetailUnit('${unit.name}', ${index})">Ver mas detalles de la unidad</button>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>

//                 <!-- Columna 2: Pie Chart -->
//                 <div class="col-md-4 border-start">
//                   <div class="h-100 d-flex align-items-center justify-content-center">
//                     <div id="root-chart-day-pie-${index}" class="w-100"></div>
//                   </div>
//                 </div>

//                 <!-- Columna 3: Bar Chart -->
//                 <div class="col-md-4 border-start">
//                   <div class="h-100 d-flex align-items-center justify-content-center">
//                     <div id="root-chart-day-bar-${index}" class="w-100"></div>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       `);
//       index++;
//     }
//   }
// };