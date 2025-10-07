import timestamp from "./timestamp.js";
import MessagesService from "./getMessages.js";
import Haversine from "../../utils/Haversine.js";
import Performance from "../../utils/Performance.js";
import { convertTimestamp } from "../../utils/timestamp.js";
import { getSensorValues, getSensorByName } from "./getSensors.js";
import { eliminarRepetidosConsecutivos, agruparPorHora, agruparPorDia } from "./getPerformanceFuel.js";


/* Manejo de fechas */
    const endDate = new Date( new Date() );
    endDate.setHours(23, 59, 0, 0);

    const startDate = new Date( new Date() );
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    let from = timestamp.formatLocalDate(startDate);
    let to = timestamp.formatLocalDate(endDate);

    from = timestamp.toUnixTimestamp(from)
    to = timestamp.toUnixTimestamp(to)

/* Manejo de servicio de mensajes por fechas */
    const messageService = new MessagesService(from, to);

export const createObjetUnit = async (_unit) => {
    return {
        name: _unit.getName(),
        sensors: getSensorValues(_unit),
        last_message: _unit.getLastMessage(),
        dateParsed: convertTimestamp(_unit.getLastMessage().t),
        id_unidad: _unit.getId(),
        icon: _unit.getIconUrl(32),
        data: await getDataProps( _unit ),
    };
}

const getDataProps = async ( unit ) => {
    const messages = await getMessages( unit.getId() )
    const sensor_fuel = getSensorByName('COMBUSTIBLE DASHBOARD', unit.getSensors())?.id ?? 0;
    
    if (messages.length) {
        const coordinates = [];
        const combustibles = [];
        let rendimiento;
        let combustibleLimpio;
        let cont_excesos_de_velocidad = 0;

        messages.map(message => {

            if (message.pos?.x && message.pos?.y) {
                coordinates.push([message.pos.x, message.pos.y])

                if( message.pos?.s > 95 ){
                    console.log( message.pos?.s );
                    
                    cont_excesos_de_velocidad ++;
                }
            }

            if( message.pos?.s == 0 ){
                const combustible = unit.calculateSensorValue(sensor_fuel, message);
                
                if (combustible != -348201.3876) {
                    const time = new Date(message.t * 1000).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })
                    
                    if( timestamp.isQuarterHour(time, 0) ){
                        combustibles.push({
                            'timestamp': message.t,
                            'hour': time,
                            'fuel': Math.round(combustible),
                            'speed': message.pos.s,
                            'mov': message.p.movement_sens
                        })
                    }
                }
            }
        })

        combustibleLimpio = eliminarRepetidosConsecutivos(combustibles)
        combustibleLimpio = agruparPorHora(combustibleLimpio);
        combustibleLimpio = agruparPorDia(combustibleLimpio);
        rendimiento = Performance.calcularRendimiento(
            Math.round(Haversine.calculateDistanceByLatLong(coordinates)),
            Math.round(combustibleLimpio.totalDescarga)
        );
        
        return {
            'km_recorridos': Haversine.calculateDistanceByLatLong(coordinates),
            'combustible_utilizado': combustibleLimpio.totalDescarga,
            'rendimiento': rendimiento,
            'excesos_de_velocidad': cont_excesos_de_velocidad,
        };
    }
}

const getMessages = async (unit) => {
    const unit_messages = await messageService.loadMessages(unit);
    return unit_messages.messages
}