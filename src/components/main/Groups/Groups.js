export const getGroups = ( groups ) => {
    let cont = 0
    const _groups = {};
    groups.forEach( group  => {
        const name = group.getName();
        
        const objt = {
            name: name,
            icon: group.getIconUrl(32),
            units: group.getUnits(),
            id_group: group.getId()
            // length: Object.keys(groups[0]).length,
        }

        _groups[name] = objt;

        htmlCreateGroups(objt)
        
        if (!['GAFI CEDIS GMZ', 'GAFI CEDIS CHIH'].includes(name)){
            $("#cont-all-units").html(cont += objt.units.length);
        }

    });

    return _groups;
}

const htmlCreateGroups = (data) => {

    // --- 1) Card de "Todas las unidades" ---
    if ($('#root_tab_all_units').length == 0) {
        $("#root-tab-todas").append(`
            <div class="card mb-3 col-auto shadow-lg border-0 btn-groups" 
                 onClick="getInfocard('Todas', '', 0, 'all_units')" 
                 style="cursor: pointer; min-width: 220px;">
                 
                <div class="d-flex align-items-center justify-content-center gap-2 p-2"
                     id="root_tab_all_units">

                    <div class="d-flex align-items-center">
                        <img src="./src/assets/img/logojd.png" width="40" height="40" class="rounded-circle">
                    </div>

                    <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
                        <span class="small text-muted text-truncate">Todas las unidades</span>
                    </div>

                    <div class="d-flex align-items-center">
                        <span id="cont-all-units" class="fw-bold fs-5">0</span>
                    </div>
                </div>
            </div>
        `);
    }

    // --- 2) Determinar si el grupo va a TAB CEDIS ---
    const gruposCedis = ["GAFI CEDIS CHIH", "GAFI CEDIS GMZ"];
    const esCedis = gruposCedis.includes(data.name);

    // Contenedor según corresponda
    const contenedor = esCedis ? "#root-tab-cedis" : "#root-tab-grupos";

    // --- 3) Pintar el grupo en su tab correcto ---
    $(contenedor).append(`
        <div class="card mb-3 col-auto shadow-sm border-0 btn-groups" 
            onClick="getInfocard('${data.name}', '', ${data.units.length}, '${data.name}', ${data.id_group})"
            style="cursor: pointer; min-width: 220px;">

            <div class="d-flex align-items-center justify-content-center gap-2 p-2 rounded-4"
                id="root_card_${data.name.replaceAll(' ', '_')}">

                <div class="d-flex align-items-center">
                    <img src="${data.icon}" width="40" height="40" class="rounded-circle">
                </div>

                <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
                    <span class="small text-muted text-truncate" title="${data.name}">
                        ${data.name}
                    </span>
                </div>

                <div class="d-flex align-items-center">
                    <span class="fw-bold fs-5">${data.units.length}</span>
                </div>
            </div>
        </div>
    `);
};

export const CreateNavTabGroups = () => {
    return `
        <ul class="nav nav-tabs mb-3" id="nav-groups">
            <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-todas">Todas</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-grupos">Grupos</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-cedis">CEDIS</button>
            </li>
        </ul>

        <div class="tab-content">
            <div class="tab-pane fade show active" id="tab-todas">
                <div class="d-flex flex-wrap gap-2" id="root-tab-todas"></div>
            </div>

            <div class="tab-pane fade" id="tab-grupos">
                <div class="d-flex flex-wrap gap-2" id="root-tab-grupos"></div>
            </div>

            <div class="tab-pane fade" id="tab-cedis">
                <div class="d-flex flex-wrap gap-2" id="root-tab-cedis"></div>
            </div>
        </div>
    `
}

// const htmlCreateGroups = (data) => {
//     if ($('body #root_card_all_units').length == 0) {
//         $("#root-card-groups").append(`
//             <div class="card mb-3 col-auto shadow-lg border-0 btn-groups" onClick="getInfocard('Todas', '', 0, 'all_units')" style="cursor: pointer; min-width: 220px;">
//                 <div class="d-flex align-items-center justify-content-center gap-2 p-2" id="root_card_all_units">
//                     <!-- Imagen -->
//                     <div class="d-flex align-items-center">
//                         <img src="./src/assets/img/logojd.png" alt="icon" width="40" height="40" class="rounded-circle">
//                     </div>

//                     <!-- Nombre (single-line, truncable si hace falta) -->
//                     <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
//                         <span class="small text-muted d-inline-block text-truncate" title="Todas las unidades">Todas las unidades</span>
//                     </div>

//                     <!-- Contador -->
//                     <div class="d-flex align-items-center">
//                         <span id="cont-all-units" class="fw-bold fs-5">0</span>
//                     </div>
//                 </div>
//             </div>
//         `);
//     }
    
//     $("#root-card-groups").append(`
//         <div class="card mb-3 col-auto shadow-sm border-0 btn-groups" onClick="getInfocard('${data.name}', '', ${data.units.length}, '${data.name}', ${data.id_group})" style="cursor: pointer; min-width: 220px;">
//             <div class="d-flex align-items-center justify-content-center gap-2 p-2 hover-animate rounded-4" id="root_card_${data.name.replaceAll(' ', '_')}">
//                 <!-- Imagen -->
//                 <div class="d-flex align-items-center">
//                     <img src="${data.icon}" alt="icon" width="40" height="40" class="rounded-circle">
//                 </div>

//                 <!-- Nombre -->
//                 <div class="flex-grow-1 text-truncate text-center" style="min-width: 110px;">
//                     <span class="small text-muted d-inline-block text-truncate" title="${data.name}">
//                         ${data.name}
//                     </span>
//                 </div>

//                 <!-- Contador -->
//                 <div class="d-flex align-items-center">
//                     <span class="fw-bold fs-5">${data.units.length}</span>
//                 </div>
//             </div>
//         </div>
//     `);
// }