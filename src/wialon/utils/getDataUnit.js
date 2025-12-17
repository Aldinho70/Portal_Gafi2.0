import { getSensorValues } from "./getSensors.js";
import { convertTimestamp } from "../../utils/timestamp.js";
import { calificarRendimiento } from "./getPerformanceFuel.js";

export const createObjetUnit = async (_unit) => {
  return {
        name: _unit.getName(),
        sensors: getSensorValues(_unit),
        last_message: _unit.getLastMessage(),
        dateParsed: convertTimestamp(_unit.getLastMessage().t),
        id_unidad: _unit.getId(),
        icon: _unit.getIconUrl(32),
      };
}
  
export const updateUnitCard = ( id, data ) => {
  const card = $(`#card-${id}`);
  if (!card.length) return;
  
  card.find('.km').text(`${data?.["KILOMETRAJE"] ?? 0}`);
  card.find('.combustible').text(`${data?.["COMBUSTIBLE CONSUMIDO"] ?? 0}`);
  card.find('.rendimiento').text(`${data?.["RENDIMIENTO DE UNIDAD"] ?? 0}`);
  card.find('.excesos').text( data?.["Velocidad máxima en viajes"] ?? 0 );
  card.find('.ralenti').text( data?.["Horas de motor en ralentí"] ?? 0 );
  card.find('#cont-porcent').text( `${calificarRendimiento( data?.["RENDIMIENTO DE UNIDAD"].slice(0, 2) ?? 0 )}%` );

  card.find('.spinner-border').remove();
}

export const getIdItem = ( session, itemName ) => {
  const target = 
    session.getItems("avl_unit_group").find(g => g.getName() === itemName) ||
    session.getItems("avl_unit").find(u => u.getName() === itemName);

  return target.getId();
}