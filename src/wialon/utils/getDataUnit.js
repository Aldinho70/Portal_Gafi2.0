import { getSensorValues, getSensorsValueByMessages, calcularTiemposBomba, getValueByNameSensor } from "./getSensors.js";
import { convertTimestamp } from "../../utils/timestamp.js";
export const createObjetUnit = ( _unit ) =>{
    return {
        name: _unit.getName(),
        sensors: getSensorValues(_unit),
        last_message: _unit.getLastMessage(),
        dateParsed: convertTimestamp(_unit.getLastMessage().t),
        id_unidad: _unit.getId(),
        icon: _unit.getIconUrl(32)
    };
}