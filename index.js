import { clearHTML } from './src/utils/utils.js';
import wialonSDK from './src/wialon/sdk/wialonSDK.js';
import { getFechaActual } from './src/utils/timestamp.js';
import MessagesService from './src/wialon/utils/getMessages.js';
import { getGroups } from './src/components/main/Groups/Groups.js';
import { createObjetUnit } from './src/wialon/utils/getDataUnit.js';
import { viewMap3D, quitMap3D } from './src/components/main/GoogleMaps/GoogleMaps.js';
import { htmlCreateCard, /*htmListCard*/ } from './src/components/main/main.js';
import { htmlCreateNotification } from './src/components/main/Notifications.js';
import { createSidebarDetailBody } from './src/components/main/SidebarDetailUnit/SidebarDetailUnit.js';

window.createSidebarDetailBody = createSidebarDetailBody;
window.viewMap3D = viewMap3D;
window.quitMap3D = quitMap3D;

const TOKEN = "733a7307cd0dd55c139f57fcaa9269d33033EF2588751D51ECB53AA291A5B6501EF5426B";
const from = '2025-05-13T23:59';
const to = '2025-05-14T23:59';

let session;
let _groups;
let data_units = [];
let messageService;
let _group_select = 'all_units';

export async function iniciarWialon() {
    try {
        //Instanciar el  objeto de mensajes de unidad.
        messageService = new MessagesService(from, to);

        //Marcar evento para escuchar notificciones.

        //Limpiar la vista para cargar datos nuevos.
        clearHTML("#root-card", "#root-card-info", "#root-card-groups", "#root-list-card");

        //Ponemos la fecha actual
        $('#root-fecha').html(`Ultima actualizacion: ${getFechaActual()}`);

        const _units = [];

        session = await wialonSDK.init(TOKEN);
        const user = session.getCurrUser();
        const groups = session.getItems('avl_unit_group');
        const resources = session.getItems('avl_resource');
        const all_units = session.getItems('avl_unit');

        resources.forEach(resource => {
            resource.addListener("messageRegistered", htmlCreateNotification);
        });

        _groups = getGroups(groups);

        data_units = (_group_select !== 'all_units')
            ? all_units.filter(unit => _groups[_group_select].units.includes(unit.getId()))
            : all_units;

        for (const _unit of data_units) {
            // const unidad = crearObjetoUnidad(_unit);
            const unidad = await createObjetUnit(_unit);
            // clasificarUnidad(unidad, _unit);
            _units.push(unidad);
        }

        $(`#root_card_${_group_select.replaceAll(' ', '_')}`).addClass('bg-warning');

        htmlCreateCard(_units);

        if (sessionStorage.getItem('card_actived')) {
            $(`#root_card_${sessionStorage.getItem('card_actived')}`).addClass('bg-warning');
            $(`#root_card_${sessionStorage.getItem('card_actived')}`).click();

            if (sessionStorage.getItem('id_acordeon')) {
                // $(`#collapse-${sessionStorage.getItem('id_acordeon')}`).addClass('show');
                $(`#button-accordion-${sessionStorage.getItem('id_acordeon')}`).click();
            }
        }
        $("#loading").fadeOut();
    } catch (error) {
        console.error("Error al iniciar Wialon:", error);
    }
}

const getInfocard = (name, owner = '', total = 0, group_select) => {
    if (group_select) {
        $("#loading").fadeIn();
        _group_select = group_select;
        wialonSDK.logout(TOKEN);
        clearHTML("#root-list-card", "#root-categori");
        $('#root-card').removeClass('d-none')
    } else {
        // const all_data = { _voltaje, _gabinete, _estado };
        // htmListCard(all_data[owner][name], name, total);
    }
};
window.getInfocard = getInfocard;

iniciarWialon();
// setInterval(() => {
//     wialonSDK.logout(TOKEN);
// }, 1 * 60 * 1000);
