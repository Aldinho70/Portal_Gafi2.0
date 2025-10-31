$('input[name="range"]').on('change', function() {
  const days = $(this).val(); // 7 o 30
  console.log(`Seleccionado: ${days} días`);

  // Llamas tu función con ese rango
  const { from, to } = getToFromByDays(days);
  console.log(from, to);

  // Aquí puedes refrescar tus datos, gráfica, tabla, etc.
//   actualizarDashboard(from, to);
});