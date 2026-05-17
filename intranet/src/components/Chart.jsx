/**
 * Wrapper de Chart.js para React.
 *
 * Crea una instancia de Chart.js sobre un <canvas> al montar y la destruye
 * al desmontar o cuando cambian las props. Esto evita el memory leak tipico
 * de Chart.js cuando se usa dentro de componentes React sin cleanup manual.
 *
 * Importante:
 *   - El <canvas> renderizado NO tiene dimensiones propias. El consumidor
 *     debe envolverlo en un contenedor con width y height definidos por CSS
 *     y pasar options.responsive=true + options.maintainAspectRatio=false
 *     si quiere que el chart se adapte al contenedor padre.
 *   - Las props data y options son objetos. Si se declaran inline dentro
 *     del JSX cambian de referencia en cada render y el chart se re-crea.
 *     Para datasets estaticos, declararlos fuera del componente o
 *     memoizarlos con useMemo.
 *
 * Props:
 *   - type    : string, tipo de chart de Chart.js ("bar", "line", "pie",
 *               "doughnut", "radar", "polarArea").
 *   - data    : objeto Chart.js Data (labels + datasets).
 *   - options : objeto Chart.js Options. Opcional.
 *
 * @example
 *   const datosBarras = {
 *     labels: ["Ene", "Feb", "Mar"],
 *     datasets: [{ label: "Proyectos", data: [4, 7, 3] }],
 *   };
 *   <Chart type="bar" data={datosBarras} />
 */

import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';

function Chart({ type, data, options }) {
  // Referencia al elemento <canvas> en el DOM. La usa Chart.js para dibujar.
  const canvasRef = useRef(null);
  // Referencia a la instancia activa de Chart.js. Se conserva para poder
  // destruirla manualmente cuando React desmonte el componente o cambien
  // las props; Chart.js no se limpia solo.
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Defensa: si por algun motivo el canvas no esta montado, salimos.
    if (!canvasRef.current) return undefined;

    // Si ya existia una instancia, la destruimos antes de crear la nueva.
    // Esto cubre el caso de cambio de props (p. ej. cambiar el tipo de
    // chart o el dataset).
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    chartInstanceRef.current = new ChartJS(canvasRef.current, {
      type: type,
      data: data,
      options: options || {},
    });

    // Cleanup al desmontar o al ejecutarse de nuevo el efecto: liberar la
    // instancia activa para que el canvas quede libre.
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, options]);

  return <canvas ref={canvasRef} />;
}

export default Chart;