$(() => {
  $("body").append(
    createModalLimitSpeed(),
    createModalRoundFuel()
  );
});


const createModalLimitSpeed = () => {
    return `
        <div class="modal" tabindex="-1" id="modal-limit-speed">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Lista de unidades que rebasaron el maximo de velocidad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="root-modal-body-limit-speed">
                        
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
    `
}

const createModalRoundFuel = () => {
    return `
        <div class="modal" tabindex="-1" id="modal-round-fuel">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Lista de unidades con sus rendimientos</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="root-modal-body-round-fuel">
                        
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
    `
}