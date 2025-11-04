import { clearHTML } from "../../../utils/utils.js";

export const getGroups = ( groups ) => {
    let cont = 0
    const _groups = {};
    groups.forEach( group  => {
        const name = group.getName();
        
        const objt = {
            name: name,
            icon: group.getIconUrl(32),
            units: group.getUnits(),
            // length: Object.keys(groups[0]).length,
        }

        _groups[name] = objt;

        htmlCreateGroups(objt)
        $("#cont-all-units").html( cont += objt.units.length  )
    });

    return _groups;
}

const htmlCreateGroups = (data) => {
    if ($('body #root_card_all_units').length == 0) {
        $("#root-card-groups").append(`
            <div class="card mb-3 col-auto shadow-lg border-0 btn-groups" onClick="getInfocard('Todas', '', 0, 'all_units')" style="cursor: pointer; min-width: 220px;">
                <div class="d-flex align-items-center justify-content-center gap-2 p-2" id="root_card_all_units">
                    <!-- Imagen -->
                    <div class="d-flex align-items-center">
                        <img src="./src/assets/img/logojd.png" alt="icon" width="40" height="40" class="rounded-circle">
                    </div>

                    <!-- Nombre (single-line, truncable si hace falta) -->
                    <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
                        <span class="small text-muted d-inline-block text-truncate" title="Todas las unidades">Todas las unidades</span>
                    </div>

                    <!-- Contador -->
                    <div class="d-flex align-items-center">
                        <span id="cont-all-units" class="fw-bold fs-5">0</span>
                    </div>
                </div>
            </div>
        `);
    }
    
    $("#root-card-groups").append(`
        <div class="card mb-3 col-auto shadow-sm border-0 btn-groups" onClick="getInfocard('${data.name}', '', ${data.units.length}, '${data.name}')" style="cursor: pointer; min-width: 220px;">
            <div class="d-flex align-items-center justify-content-center gap-2 p-2 hover-animate rounded-4" id="root_card_${data.name.replaceAll(' ', '_')}">
                <!-- Imagen -->
                <div class="d-flex align-items-center">
                    <img src="${data.icon}" alt="icon" width="40" height="40" class="rounded-circle">
                </div>

                <!-- Nombre -->
                <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
                    <span class="small text-muted d-inline-block text-truncate" title="${data.name}">
                        ${data.name}
                    </span>
                </div>

                <!-- Contador -->
                <div class="d-flex align-items-center">
                    <span class="fw-bold fs-5">${data.units.length}</span>
                </div>
            </div>
        </div>
    `);
}