import timestamp from "./timestamp.js";
import MessagesService from "./getMessages.js";
import Haversine from "../../utils/Haversine.js";
import { ejecutarReporte } from "./getReports.js";
import Performance from "../../utils/Performance.js";
import { getSensorValues, getSensorByName } from "./getSensors.js";
import { getGroupSummary } from "../../components/main/kpis/Kpis_groups.js";
import { convertTimestamp, getToFromByDays, calcularTiempoTotalByArrayTimestamp } from "../../utils/timestamp.js";
import { eliminarRepetidosConsecutivos, agruparPorHora, agruparPorDia, calificarRendimiento } from "./getPerformanceFuel.js";

export let array_units_props = [];

export const createObjetUnit = async (_unit) => {
  return {
        name: _unit.getName(),
        sensors: getSensorValues(_unit),
        last_message: _unit.getLastMessage(),
        dateParsed: convertTimestamp(_unit.getLastMessage().t),
        id_unidad: _unit.getId(),
        icon: _unit.getIconUrl(32),
        
        // data: await getDataProps(_unit),
    };
}

export const loadUnitsDataInBatches =  async (units, batchSize = 10)  => {
    for (let i = 0; i < units.length; i += batchSize) {
        const batch = units.slice(i, i + batchSize);

        const promises = batch.map(async (unit) => {
            const data = await getDataProps2(unit); // depende de cómo guardó la ref.
            
            unit.data = data;
            updateUnitCard(unit.id_unidad, data);
        });

        await Promise.all(promises); // Espera que termine el lote
    }

    await getGroupSummary( units );
}

export const getDataProps2 = async (unit) => {
  const session = wialon.core.Session.getInstance();
  const resources = session.getItems("avl_resource");
  // console.log(resources);
  
  
  await ejecutarReporte( resources, "COMBUSTIBLE DIARIO UNIDAD GAFI", "GAFI 252", 7, session )
  // ejecutarReporte( resources, "COMBUSTIBLE DIARIO UNIDAD GAFI", "GAFI 252", 7 );
};

export const getDataProps = async (unit) => {
  const _unit = wialon.core.Session.getInstance().getItem(unit.id_unidad);
  const messages = await getMessages(_unit?.getId());
  
  // const sensor_fuel = getSensorByName('COMBUSTIBLE DASHBOARD', _unit.getSensors())?.id ?? 0;
  const sensor_fuel = getSensorByName('COMBUSTIBLE DASHBOARD', _unit.getSensors())?.id
    ? _unit.getSensor(getSensorByName('COMBUSTIBLE DASHBOARD', _unit.getSensors()).id)
    : 0;

  if (messages.length) {
    const coordinates = [];
    const combustibles = [];
    const velocidades = [];
    // const ralenti = [];
    let cont_excesos_de_velocidad = 0;
    let cont_no_excesos_de_velocidad = 0;

    messages.map( async message => {
      if (message.pos?.x && message.pos?.y) {
        coordinates.push([message.pos.x, message.pos.y]);
        if (message.pos?.s > 95){
          cont_excesos_de_velocidad++;
        }else if( message.pos?.s > 0 && message.pos?.s < 90 ){
          cont_no_excesos_de_velocidad++;
        } 
      }

      if ( message.pos?.s == 0 ) {
        
        // if( message?.i > 0
        
        const combustible = _unit.calculateSensorValue(sensor_fuel, message);
        
        if (combustible != -348201.3876) {
          
          const time = new Date(message.t * 1000).toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          if (timestamp.isQuarterHour(time, 0)) {
            combustibles.push({
              timestamp: message.t,
              hour: time,
              fuel: Math.round(combustible),
              speed: message.pos.s,
              mov: message.p.movement_sens
            });
          }
        }
      }else{
        velocidades.push( message.pos?.s ?? 0 )
      }
    });

    // console.log( ralenti );
    // console.log( calcularTiempoTotalByArrayTimestamp(ralenti) );
    
    let combustibleLimpio = eliminarRepetidosConsecutivos(combustibles);
    combustibleLimpio = agruparPorHora(combustibleLimpio);
    combustibleLimpio = agruparPorDia(combustibleLimpio);

    const distancia = Math.round(Haversine.calculateDistanceByLatLong(coordinates));
    const totalDescarga = Math.round(combustibleLimpio.totalDescarga);
    const rendimiento = Performance.calcularRendimiento(distancia, totalDescarga);

    return {
      km_recorridos: distancia,
      combustible_utilizado: totalDescarga,
      rendimiento,
      excesos_de_velocidad: cont_excesos_de_velocidad,
      no_excesos_de_velocidad: cont_no_excesos_de_velocidad,
      velocidades: velocidades,
    };
  }

  // 👇 Retornar nulo si no hay mensajes
  return null;
};

const messageService = new MessagesService(...Object.values(getToFromByDays(7)));
const getMessages = async (unit) => {
    const unit_messages = await messageService.loadMessages(unit);
    return unit_messages.messages
}

const updateUnitCard = (id, data) => {
    const card = $(`#card-${id}`);
    if (!card.length) return;

    card.find('.km').text(`${Math.round(data?.km_recorridos ?? 0)} km`);
    card.find('.combustible').text(`${Math.round(data?.combustible_utilizado ?? 0)} L`);
    card.find('.rendimiento').text(`${Math.round(data?.rendimiento ?? 0)} km/L`);
    card.find('.excesos').text(`${data?.excesos_de_velocidad ?? 0} veces`);
    card.find('#cont-porcent').text( `${calificarRendimiento( data?.rendimiento ?? 0 )}%` );

    // Remover spinner
    card.find('.spinner-border').remove();
  }
  
  export const updateUnitCard2 = ( id, data ) => {
    // console.log(data);
    array_units_props.push( data )
    
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

  export const kpis_grupal = () => {
    // console.log(array_units_props);
    return array_units_props
    
  }

  export const clear_kpis = () =>{
    array_units_props = []
  }
