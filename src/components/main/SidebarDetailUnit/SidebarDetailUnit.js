import { IframeMap } from "../Map/Map.js"

$( () => {
    $( "body" ).append(createSideBarDetailUnit());
} )

export const createSideBarDetailUnit = (  ) => {
    return `
        <div class="offcanvas offcanvas-end " tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" style="width: 50vw">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasRightLabel">Informacion de la unidad.</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex gap-5" id="root_sidebar_right">
                <iframe
                    id="iframeDetailsUnit"
                    title="Inline Frame Example"
                    width="100%"
                    height="100%"
                    src="http://ws4cjdg.com/RendimientoGafi.com/index.html">
                </iframe>
            </div>
        </div>
    `
}

export const createSidebarDetailBody = ( unit ) => {
//   const _URI = (window.location.hostname === "ws4cjdg.com") ? URI.URI_PRODUCCION : URI.URI_DEV;
//   $("#iframeDetailsUnit").attr("src", `${_URI}?idUnit=${unit}`);
  $("#iframeDetailsUnit").attr("src", `http://ws4cjdg.com/RendimientoGafi.com/index.html?idUnit=${unit}`);
//   $("#right-panel").removeClass("closed");
//   $("#close-right-panel-btn").removeClass("visually-hidden");
}