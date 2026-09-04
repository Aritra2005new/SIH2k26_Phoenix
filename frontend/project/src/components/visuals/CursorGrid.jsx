import { useRef, useEffect } from 'react';
import './CursorGrid.css';

const FALLOFF_CURVES = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const v =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;

  const num = parseInt(v.slice(0, 6), 16);

  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
  ];
};

export default function CursorGrid({
  cellSize = 70,
  color = '#D946EF',
  radius = 140,
  falloff = 'smooth',
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0,
  cellRadius = 0,
  clickPulse = true,
  pulseSpeed = 600,
  className = '',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const propsRef = useRef({});
  const wakeRef = useRef(null);

  propsRef.current = {
    cellSize,
    color,
    radius,
    falloff,
    holdTime,
    fadeDuration,
    lineWidth,
    maxOpacity,
    fillOpacity,
    gridOpacity,
    cellRadius,
    clickPulse,
    pulseSpeed,
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let w = 0;
    let h = 0;

    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);

    const pulses = [];

    let raf = 0;
    let running = false;
    let lastFrame = 0;

    // --------------------------------------------------
    // BUILD GRID
    // --------------------------------------------------

    const rebuild = () => {
      const p = propsRef.current;

      w = container.offsetWidth;
      h = container.offsetHeight;

      if (w <= 0 || h <= 0) return;

      canvas.width = Math.max(
        1,
        Math.round(w * dpr)
      );

      canvas.height = Math.max(
        1,
        Math.round(h * dpr)
      );

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      cols =
        Math.ceil(w / p.cellSize) + 1;

      rows =
        Math.ceil(h / p.cellSize) + 1;

      // Center the grid
      offX =
        (w - cols * p.cellSize) / 2;

      offY =
        (h - rows * p.cellSize) / 2;

      alphas =
        new Float32Array(cols * rows);

      touched =
        new Float64Array(cols * rows);
    };

    // --------------------------------------------------
    // CELL CENTER
    // --------------------------------------------------

    const cellCenter = (i) => {
      const p = propsRef.current;

      return [
        offX +
          (i % cols) * p.cellSize +
          p.cellSize / 2,

        offY +
          Math.floor(i / cols) *
            p.cellSize +
          p.cellSize / 2,
      ];
    };

    // --------------------------------------------------
    // LIGHT UP CELLS
    // --------------------------------------------------

    const energize = (
      x,
      y,
      boost = 1
    ) => {
      const p = propsRef.current;

      const r = Math.max(
        p.radius,
        1
      );

      const ease =
        FALLOFF_CURVES[p.falloff] ??
        FALLOFF_CURVES.linear;

      const now =
        performance.now();

      const minCol = Math.max(
        0,
        Math.floor(
          (x - r - offX) /
            p.cellSize
        )
      );

      const maxCol = Math.min(
        cols - 1,
        Math.floor(
          (x + r - offX) /
            p.cellSize
        )
      );

      const minRow = Math.max(
        0,
        Math.floor(
          (y - r - offY) /
            p.cellSize
        )
      );

      const maxRow = Math.min(
        rows - 1,
        Math.floor(
          (y + r - offY) /
            p.cellSize
        )
      );

      for (
        let row = minRow;
        row <= maxRow;
        row++
      ) {
        for (
          let col = minCol;
          col <= maxCol;
          col++
        ) {
          const i =
            row * cols + col;

          const [cx, cy] =
            cellCenter(i);

          const dist =
            Math.hypot(
              cx - x,
              cy - y
            );

          if (dist > r) continue;

          const level =
            ease(1 - dist / r) *
            p.maxOpacity *
            boost;

          if (level > alphas[i]) {
            alphas[i] = level;
          }

          if (level > 0) {
            touched[i] = now;
          }
        }
      }
    };

    // --------------------------------------------------
    // DRAW
    // --------------------------------------------------

    const draw = (now) => {
      const p = propsRef.current;

      const dt = Math.min(
        now - lastFrame,
        50
      );

      lastFrame = now;

      ctx.clearRect(
        0,
        0,
        w,
        h
      );

      const [cr, cg, cb] =
        hexToRgb(p.color);

      // Static grid
      if (p.gridOpacity > 0) {
        ctx.strokeStyle = `rgba(
          ${cr},
          ${cg},
          ${cb},
          ${p.gridOpacity}
        )`;

        ctx.lineWidth = 1;

        ctx.beginPath();

        for (
          let col = 0;
          col <= cols;
          col++
        ) {
          const x =
            Math.round(
              offX +
                col *
                  p.cellSize
            ) + 0.5;

          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }

        for (
          let row = 0;
          row <= rows;
          row++
        ) {
          const y =
            Math.round(
              offY +
                row *
                  p.cellSize
            ) + 0.5;

          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }

        ctx.stroke();
      }

      // ------------------------------------------------
      // CLICK PULSES
      // ------------------------------------------------

      for (
        let pi = pulses.length - 1;
        pi >= 0;
        pi--
      ) {
        const pulse =
          pulses[pi];

        const age =
          (now - pulse.t0) / 1000;

        const ringR =
          age * p.pulseSpeed;

        if (
          ringR >
          Math.hypot(w, h)
        ) {
          pulses.splice(pi, 1);
          continue;
        }

        const band =
          p.cellSize;

        const minCol =
          Math.max(
            0,
            Math.floor(
              (pulse.x -
                ringR -
                band -
                offX) /
                p.cellSize
            )
          );

        const maxCol =
          Math.min(
            cols - 1,
            Math.floor(
              (pulse.x +
                ringR +
                band -
                offX) /
                p.cellSize
            )
          );

        const minRow =
          Math.max(
            0,
            Math.floor(
              (pulse.y -
                ringR -
                band -
                offY) /
                p.cellSize
            )
          );

        const maxRow =
          Math.min(
            rows - 1,
            Math.floor(
              (pulse.y +
                ringR +
                band -
                offY) /
                p.cellSize
            )
          );

        for (
          let row = minRow;
          row <= maxRow;
          row++
        ) {
          for (
            let col = minCol;
            col <= maxCol;
            col++
          ) {
            const i =
              row * cols + col;

            const [cx, cy] =
              cellCenter(i);

            const dist =
              Math.hypot(
                cx - pulse.x,
                cy - pulse.y
              );

            if (
              Math.abs(
                dist - ringR
              ) <
                band / 2 &&
              p.maxOpacity >
                alphas[i]
            ) {
              alphas[i] =
                p.maxOpacity;

              touched[i] = now;
            }
          }
        }
      }

      // ------------------------------------------------
      // DRAW ACTIVE CELLS
      // ------------------------------------------------

      let anyVisible =
        pulses.length > 0;

      const fadeStep =
        dt /
        Math.max(
          p.fadeDuration,
          16
        );

      const half =
        p.cellSize / 2;

      for (
        let i = 0;
        i < alphas.length;
        i++
      ) {
        let a = alphas[i];

        if (a <= 0) continue;

        if (
          now - touched[i] >
          p.holdTime
        ) {
          a = Math.max(
            0,
            a - fadeStep
          );

          alphas[i] = a;

          if (a <= 0) continue;
        }

        anyVisible = true;

        const [cx, cy] =
          cellCenter(i);

        const gradient =
          ctx.createRadialGradient(
            cx,
            cy,
            half * 0.1,
            cx,
            cy,
            p.cellSize
          );

        gradient.addColorStop(
          0,
          `rgba(
            ${cr},
            ${cg},
            ${cb},
            ${a}
          )`
        );

        gradient.addColorStop(
          1,
          `rgba(
            ${cr},
            ${cg},
            ${cb},
            0
          )`
        );

        const x =
          cx - half + 0.5;

        const y =
          cy - half + 0.5;

        const s =
          p.cellSize - 1;

        ctx.beginPath();

        if (p.cellRadius > 0) {
          ctx.roundRect(
            x,
            y,
            s,
            s,
            p.cellRadius
          );
        } else {
          ctx.rect(
            x,
            y,
            s,
            s
          );
        }

        if (
          p.fillOpacity > 0
        ) {
          ctx.fillStyle = `rgba(
            ${cr},
            ${cg},
            ${cb},
            ${a *
              p.fillOpacity}
          )`;

          ctx.fill();
        }

        ctx.strokeStyle =
          gradient;

        ctx.lineWidth =
          p.lineWidth;

        ctx.stroke();
      }

      if (anyVisible) {
        raf =
          requestAnimationFrame(
            draw
          );
      } else {
        running = false;

        if (
          propsRef.current
            .gridOpacity <= 0
        ) {
          ctx.clearRect(
            0,
            0,
            w,
            h
          );
        }
      }
    };

    // --------------------------------------------------
    // START ANIMATION
    // --------------------------------------------------

    const wake = () => {
      if (running) return;

      running = true;

      lastFrame =
        performance.now();

      raf =
        requestAnimationFrame(
          draw
        );
    };

    wakeRef.current = wake;

    // --------------------------------------------------
    // POINTER POSITION
    // --------------------------------------------------

    const toLocal = (clientX, clientY) => {
      const rect =
        container.getBoundingClientRect();

      return [
        clientX - rect.left,
        clientY - rect.top,
      ];
    };

    // IMPORTANT:
    // Listen on WINDOW instead of the canvas/container.
    // This allows the grid to work even when page content
    // is positioned above the canvas.
    const onPointerMove = (e) => {
      const [x, y] =
        toLocal(
          e.clientX,
          e.clientY
        );

      // Only react while cursor is inside
      // the CursorGrid's actual area.
      if (
        x < 0 ||
        y < 0 ||
        x > w ||
        y > h
      ) {
        return;
      }

      energize(x, y);
      wake();
    };

    // --------------------------------------------------
    // CLICK PULSE
    // --------------------------------------------------

    const onPointerDown = (e) => {
      if (
        !propsRef.current
          .clickPulse
      ) {
        return;
      }

      const [x, y] =
        toLocal(
          e.clientX,
          e.clientY
        );

      if (
        x < 0 ||
        y < 0 ||
        x > w ||
        y > h
      ) {
        return;
      }

      pulses.push({
        x,
        y,
        t0: performance.now(),
      });

      wake();
    };

    // --------------------------------------------------
    // RESIZE
    // --------------------------------------------------

    const ro =
      new ResizeObserver(() => {
        rebuild();
        wake();
      });

    ro.observe(container);

    rebuild();
    wake();

    // IMPORTANT:
    // Window receives pointer events even though
    // the canvas is behind the content.
    window.addEventListener(
      'pointermove',
      onPointerMove
    );

    window.addEventListener(
      'pointerdown',
      onPointerDown
    );

    return () => {
      cancelAnimationFrame(
        raf
      );

      ro.disconnect();

      window.removeEventListener(
        'pointermove',
        onPointerMove
      );

      window.removeEventListener(
        'pointerdown',
        onPointerDown
      );
    };
  }, [cellSize]);

  // Repaint when visual props change
  useEffect(() => {
    wakeRef.current?.();
  }, [
    gridOpacity,
    color,
    lineWidth,
    maxOpacity,
    fillOpacity,
    cellRadius,
  ]);

  return (
    <div
      ref={containerRef}
      className={`cursor-grid${
        className
          ? ` ${className}`
          : ''
      }`}
    >
      <canvas
        ref={canvasRef}
        className="cursor-grid__canvas"
      />
    </div>
  );
}