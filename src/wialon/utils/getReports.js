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

  resource.execReport(
    report,
    target.getId(),
    0,
    interval,
    (code, data) => {
      if (code) {
        console.error("Error:", wialon.core.Errors.getErrorText(code));
        return;
      }

      if (!data.getTables().length) {
        console.warn("Sin datos en el reporte");
        return;
      }

      console.log("✅ Reporte ejecutado:", data.getStatistics());
    }
  );
};

export const parseReportTables = (result) => {
  const tables = result.getTables();
  const parsed = {};

  tables.forEach(table => {
    const tableName = table.name;
    const tableLabel = table.label;

    // Extraer encabezados y totales
    const headers = table.header;
    const totals = table.total;

    // Convertir el total a objeto clave-valor
    const totalObj = {};
    headers.forEach((header, index) => {
      totalObj[header] = totals[index];
    });

    // Construir el objeto final
    parsed[tableName] = {
      label: tableLabel,
      headers: headers,
      total: totalObj
    };
  });

  return parsed;
}

export const arrayToObject = (data) => {
  if (!Array.isArray(data)) return {};

  return data.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};
