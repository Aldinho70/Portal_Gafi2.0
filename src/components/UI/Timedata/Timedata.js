import { getFechaActual } from "../../../utils/timestamp.js"
export const createTimedata = () => {
    return `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span id="root-fecha" class="text-muted small fw-semibold">
            Última actualización: ${getFechaActual()}
            </span>
        </div>`
}