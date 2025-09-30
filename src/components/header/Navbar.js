import { client_data } from "../../config/config.js";

$( () => {
    $("#root-navbar").html(`
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                ${(client_data.img) ? `<img src="${client_data.img}" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">` : ``}
                ${client_data.name}
            </a>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link disable" aria-current="page" href="#">${client_data.title_navbar}</a>
                    </li>                    
                    <li class="nav-item px-2">
                        <button type="button" class="btn btn-dark position-relative" data-bs-toggle="modal" data-bs-target="#notificationModal">
                        Notificaciones
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="notif-count">
                            0
                            <span class="visually-hidden">unread messages</span>
                        </span>
                        </button>
                    </li>                    
                    <li class="nav-item">
                        <button type="button" class="btn btn-dark position-relative" id="root_btn_view_map3d" onClick="(viewMap3D())">
                            Ir a mapa 3D
                        </button>
                    </li>                    
                    <li class="nav-item">
                        <button type="button" class="btn btn-dark position-relative visually-hidden" id="root_btn_quit_map3d" onClick="(quitMap3D())">
                            Regresa a dashboard
                        </button>
                    </li>                    
                </ul>
            </div>
        </div>
    `);
})