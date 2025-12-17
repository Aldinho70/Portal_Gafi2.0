import { TOKEN } from "./src/config/config.js";
import { clearHTML } from "./src/utils/utils.js";
import wialonSDK from "./src/wialon/sdk/wialonSDK.js";
import { getGroups } from "./src/components/main/Groups/Groups.js";
import { execReport } from "./src/components/main/kpis/Kpis_groups.js";
import { getFechaActual, getRangoFechas } from "./src/utils/timestamp.js";
import { htmlCreateCard /*htmListCard*/ } from "./src/components/main/main.js";
import { htmlCreateNotification } from "./src/components/main/Notifications.js";
import { createObjetUnit, getIdItem } from "./src/wialon/utils/getDataUnit.js";
import { viewMap3D, quitMap3D } from "./src/components/main/GoogleMaps/GoogleMaps.js";
import { ejecutarReporte, ejecutarReporteGrupal } from "./src/wialon/utils/getReports.js";
import { createSidebarDetailBody } from "./src/components/main/SidebarDetailUnit/SidebarDetailUnit.js";
import { getLimitSpeed, getRoundFuel, getDataResource, getDataReport, getDataFillingsFuel } from "./src/components/main/kpis/Kpis_groups.js";

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
      "#root-tab-cedis",
      "#root-tab-grupos",
      "#root-tab-todas",
      "#list-fuel-units",
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
      const { fechaInicio, fechaFin } = getRangoFechas();
      
      ejecutarReporteGrupal( "Z COMBUSTIBLE POR GRUPO GAFI", "Horas de Motor", _group_select, 7 );
      await getLimitSpeed(fechaInicio, fechaFin, sessionStorage.getItem('id_group_select'));
      await getRoundFuel(fechaInicio, fechaFin, sessionStorage.getItem('id_group_select'));

      const dataResource = await getDataResource( "Z COMBUSTIBLE FLOTA GAFI" );
        if( !dataResource.error ){
          const response = await getDataReport( dataResource.resourceId, dataResource.templateId, getIdItem(session, _group_select), fechaInicio, fechaFin);
          getDataFillingsFuel( response.tables[0].rows )
        }
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

const getInfocard = (name, owner = "", total = 0, group_select, id_group) => {
  sessionStorage.setItem("group_select", group_select);
  sessionStorage.setItem("id_group_select", id_group)
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
