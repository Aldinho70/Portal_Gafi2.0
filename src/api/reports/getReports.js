/**
 * Función genérica para consumir reportes PHP
 * @param {string} from - Fecha inicial (ej. '2025-11-01 00:00:00')
 * @param {string} to - Fecha final (ej. '2025-11-10 23:59:59')
 * @param {number|string} idUnit - ID de la unidad
 * @param {string} endpoint - Ruta del PHP (ej. 'speed/nombre.php')
 * @returns {Promise<object>} - Promesa con la respuesta JSON
 */
export const fetchReporte = async (from, to, idUnit, endpoint) => {
  
  const url = `http://ws4cjdg.com/wialonRemoteApi.com/Reports/${endpoint}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&idUnit=${encodeURIComponent(idUnit)}`;
//   const url = `http://localhost:8080/repos/Jornada%20Digital/Peticiones.wialon.com/Reports/${endpoint}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&idUnit=${encodeURIComponent(idUnit)}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Error en la petición: ' + response.status);
      return response.json();
    })
    .catch(error => {
      console.error('Error al obtener el reporte:', error);
      return null;
    });
}

// --- EJEMPLO DE USO ---
// fetchReporte('2025-11-01 00:00:00', '2025-11-10 23:59:59', 29566197, 'speed/nombre.php')
//   .then(data => {
//     if (data) console.log(data);
//   });
