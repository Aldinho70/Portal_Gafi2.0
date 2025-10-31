import { updateUnitCard } from "./getDataUnit.js";
import { updateKpis, getReloader } from "../../components/main/kpis/Kpis_groups.js";

export const ejecutarReporte = async (resources, reportName, objectName, days) => {
  const now = Math.floor(Date.now() / 1000);
  const weekAgo = now - days * 24 * 60 * 60;
  const session = wialon.core.Session.getInstance();

  const resource = resources.find(r => r.getName() === "CUENTA_DEMO");
  if (!resource) {
    console.error("Recurso no encontrado");
    return;
  }

  const report = Object.values(resource.getReports()).find(r => r.n === reportName);
  if (!report) {
    console.error("Reporte no encontrado");
    return;
  }

  let target = session.getItems("avl_unit_group").find(g => g.getName() === objectName) || session.getItems("avl_unit").find(u => u.getName() === objectName);

  if (!target) {
    console.error("Grupo o unidad no encontrado");
    return;
  }

  const interval = {
    from: weekAgo,
    to: now,
    flags: wialon.item.MReport.intervalFlag.absolute
  };

  resource.execReport(report, target.getId(), 0, interval,
    async (code, data) => {
      if (code || !data.getTables().length) {
        // console.error(`${target.getName()} Error:`, wialon.core.Errors.getErrorText(code));
        return
      } else {
        updateUnitCard(target.getId(), arrayToObject(data.getStatistics()))
      }

    }
  );
};

export const ejecutarReporteGrupal = async (reportName, objectName, days) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const weekAgo = now - days * 24 * 60 * 60;
    const session = wialon.core.Session.getInstance();
    const resources = session.getItems("avl_resource");

    const resource = resources.find(r => r.getName() === "CUENTA_DEMO");
    if (!resource) {
      console.error("Recurso no encontrado");
      return;
    }

    const report = Object.values(resource.getReports()).find(r => r.n === reportName);
    if (!report) {
      console.error("Reporte no encontrado");
      getReloader();
      // return;
    }

    let target = session.getItems("avl_unit_group").find(g => g.getName() === objectName) || session.getItems("avl_unit").find(u => u.getName() === objectName);

    if (!target) {
      console.error("Grupo o unidad no encontrado");
      getReloader();
      // return;
    }

    const interval = {
      from: weekAgo,
      to: now,
      flags: wialon.item.MReport.intervalFlag.absolute
    };

    resource.execReport(
      report,
      target.getId(),
      0,
      interval,
      async (code, data) => {
        if (code || !data.getTables().length) {
          // return;
          // console.log( 'MARCO ERROR Y LO VAMOS A VOLVER A LANZAR');

          // ejecutarReporteGrupal(resources, reportName, objectName, 7);
          getReloader();
        } else {
          const tables = data.getTables();
          // console.log("✅ Reporte ejecutado:", tables);
          tables.forEach((table) => {
            if (table.label == 'Horas de Motor') {
              // console.log( arrayToTable( table.header, table.total ) );
              updateKpis(objectName, arrayToTable(table.header, table.total))
            }
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    
    getReloader();
  }
};

const arrayToObject = (data) => {
  if (!Array.isArray(data)) return {};

  return data.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

const arrayToTable = (headers, totals) => {
  // console.log(headers);
  // console.log(totals);

  const obj = {}
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i];
    const value = totals[i];
    obj[key] = value
  }

  // console.log(obj);
  return obj

}