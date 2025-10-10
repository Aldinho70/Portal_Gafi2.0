import timestamp from "./timestamp.js";
import MessagesService from "./getMessages.js";
import Haversine from "../../utils/Haversine.js";
import Performance from "../../utils/Performance.js";
import { getSensorValues, getSensorByName } from "./getSensors.js";
import { convertTimestamp, getToFromByDays } from "../../utils/timestamp.js";
import { eliminarRepetidosConsecutivos, agruparPorHora, agruparPorDia, calificarRendimiento } from "./getPerformanceFuel.js";



// const messageService = new MessagesService(from, to);
const { from, to } = getToFromByDays(7)

const messageService = new MessagesService( from, to );

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
            const data = await getDataProps(unit.id_unidad); // depende de cómo guardó la ref.
            
            unit.data = data;
            updateUnitCard(unit.id_unidad, data);
        });

        await Promise.all(promises); // Espera que termine el lote
    }
}

const getDataProps = async (unit) => {
    const _unit =  wialon.core.Session.getInstance().getItem(unit);
    const messages = await getMessages( _unit?.getId() )
    // const messages = await getMessages(_unit)
    const sensor_fuel = getSensorByName('COMBUSTIBLE DASHBOARD', _unit.getSensors())?.id ?? 0;

    if (messages.length) {
        const coordinates = [];
        const combustibles = [];
        let rendimiento;
        let combustibleLimpio;
        let cont_excesos_de_velocidad = 0;

        messages.map(message => {

            if (message.pos?.x && message.pos?.y) {
                coordinates.push([message.pos.x, message.pos.y])

                if (message.pos?.s > 95) {
                    cont_excesos_de_velocidad++;
                }

            }

            if (message.pos?.s == 0) {
                const combustible = _unit.calculateSensorValue(sensor_fuel, message);

                if (combustible != -348201.3876) {
                    const time = new Date(message.t * 1000).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })

                    if (timestamp.isQuarterHour(time, 0)) {
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

const updateUnitCard = (id, data) => {
    const card = $(`#card-${id}`);
    if (!card.length) return;

    card.find('.km').text(`${Math.round(data?.km_recorridos ?? 0)} km`);
    card.find('.combustible').text(`${Math.round(data?.combustible_utilizado ?? 0)} L`);
    card.find('.rendimiento').text(`${data?.rendimiento ?? 0} km/L`);
    card.find('.excesos').text(`${data?.excesos_de_velocidad ?? 0} veces`);
    card.find('#cont-porcent').text( `${calificarRendimiento( data?.rendimiento ?? 0 )}%` );

    // Remover spinner
    card.find('.spinner-border').remove();
}