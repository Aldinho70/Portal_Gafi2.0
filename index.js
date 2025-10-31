import { TOKEN } from "./src/config/config.js";
import { clearHTML } from "./src/utils/utils.js";
import wialonSDK from "./src/wialon/sdk/wialonSDK.js";
import { getFechaActual } from "./src/utils/timestamp.js";
import { getGroups } from "./src/components/main/Groups/Groups.js";
import { createObjetUnit } from "./src/wialon/utils/getDataUnit.js";
import { execReport } from "./src/components/main/kpis/Kpis_groups.js";
import { htmlCreateCard /*htmListCard*/ } from "./src/components/main/main.js";
import { htmlCreateNotification } from "./src/components/main/Notifications.js";
import { viewMap3D, quitMap3D } from "./src/components/main/GoogleMaps/GoogleMaps.js";
import { ejecutarReporte, ejecutarReporteGrupal } from "./src/wialon/utils/getReports.js";
import { createSidebarDetailBody } from "./src/components/main/SidebarDetailUnit/SidebarDetailUnit.js";

window.createSidebarDetailBody = createSidebarDetailBody;
window.viewMap3D = viewMap3D;
window.quitMap3D = quitMap3D;
window.execReport = execReport;

let session;
let _groups;
let data_units = [];
export let _group_select = "all_units";

export async function iniciarWialon() {
  try {
    clearHTML(
      "#root-card",
      "#root-card-info",
      "#root-card-groups",
      "#root-list-card"
    );

    //Ponemos la fecha actual
    $("#root-fecha").html(`Ultima actualizacion: ${getFechaActual()}`);

    const _units = [];

    session = await wialonSDK.init(TOKEN);
    const groups = session.getItems("avl_unit_group");
    const resources = session.getItems("avl_resource");
    const all_units = session.getItems("avl_unit");
    
    if( _group_select != "all_units" ){
      ejecutarReporteGrupal( "Z COMBUSTIBLE POR GRUPO GAFI", _group_select, 7 );
      $( "#root-card-kpis" ).removeClass('visually-hidden')
    }else{
      $( "#root-card-kpis" ).addClass('visually-hidden')
    }

    resources.forEach((resource) => {
      resource.addListener("messageRegistered", htmlCreateNotification);
    });

    _groups = getGroups(groups);

    data_units =
      _group_select !== "all_units"
        ? all_units.filter((unit) =>
            _groups[_group_select].units.includes(unit.getId())
          )
        : all_units;

    for (const _unit of data_units) {
      _units.push(await createObjetUnit(_unit));
      await ejecutarReporte( resources, "COMBUSTIBLE DIARIO UNIDAD GAFI", _unit.getName(), 7 );
    }

    
    htmlCreateCard(_units);
    
    $(`#root_card_${_group_select.replaceAll(" ", "_")}`).addClass(
      "bg-warning"
    );

    if (sessionStorage.getItem("card_actived")) {
      $(`#root_card_${sessionStorage.getItem("card_actived")}`).addClass(
        "bg-warning"
      );
      $(`#root_card_${sessionStorage.getItem("card_actived")}`).click();

      if (sessionStorage.getItem("id_acordeon")) {
        // $(`#collapse-${sessionStorage.getItem('id_acordeon')}`).addClass('show');
        $(`#button-accordion-${sessionStorage.getItem("id_acordeon")}`).click();
      }
    }
    $("#loading").fadeOut();
  } catch (error) {
    console.error("Error al iniciar Wialon:", error);
  }
}

const getInfocard = (name, owner = "", total = 0, group_select) => {
  console.log(group_select);
  sessionStorage.setItem("group_select", group_select);
  if (group_select) {
    $("#loading").fadeIn();
    $("#loading_kpis").fadeIn();
    _group_select = group_select;
    wialonSDK.logout(TOKEN);
    clearHTML("#root-list-card", "#root-categori");
    $("#root-card").removeClass("d-none");
    $("#root_kpis").addClass("visually-hidden");
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
