$( () => {
    $( "#root-main" ).append(GoogleMaps3D());
} )

const GoogleMaps3D = () => {
    return `
        <div class="visually-hidden w-100" id="root-google-maps-3d">
            <iframe
                id=""
                title="Inline Frame Example"
                width="100%"
                height="100%"
                src="http://ws4cjdg.com/dashboardGafi.com/">
            </iframe>
        </div>
    `
}

export const viewMap3D = ( ) => {
    $("#root-google-maps-3d").removeClass('visually-hidden')
    $("#root_btn_quit_map3d").removeClass('visually-hidden')
    $("#sidebar").addClass('visually-hidden')
    $("#mainContent").addClass('visually-hidden')
    $("#root_btn_view_map3d").addClass('visually-hidden')
}

export const quitMap3D = ( ) => {
    $("#root-google-maps-3d").addClass('visually-hidden')
    $("#root_btn_quit_map3d").addClass('visually-hidden')
    $("#sidebar").removeClass('visually-hidden')
    $("#mainContent").removeClass('visually-hidden')
    $("#root_btn_view_map3d").removeClass('visually-hidden')

    // location.reload();
}