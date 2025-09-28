import { IframeMap } from "../Map/Map.js"

$( () => {
    $( "body" ).append(createSideBarDetailUnit());
} )

export const createSideBarDetailUnit = () => {
    return `
        <div class="offcanvas offcanvas-end " tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style="width: 50vw">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasRightLabel">Informacion de la unidad.</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex gap-5">
                ${ IframeMap('123', '-103') }
                <h1>En proceso</h1>
            </div>
        </div>
    `
}