'use client';

import { useEffect, useRef } from 'react';
import type P5 from 'p5';

export default function P5Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let myP5: P5 | undefined;

    const loadSketch = async () => {
      const p5 = (await import('p5')).default;

      const sketch = (p: P5) => {
        let x = 200;
        let y = 200;
        let xSpeed = 2;
        let ySpeed = 3;

        p.setup = () => {
          p.createCanvas(400, 400);
        };

        p.draw = () => {
          p.background(220);

          p.ellipse(x, y, 50, 50);

          x += xSpeed;
          y += ySpeed;

          if (x > p.width - 25 || x < 25) {
            xSpeed *= -1;
          }

          if (y > p.height - 25 || y < 25) {
            ySpeed *= -1;
          }
        };
      };

      if (sketchRef.current) {
        myP5 = new p5(sketch, sketchRef.current);
      }
    };

    loadSketch();

    return () => {
      myP5?.remove();
    };
  }, []);

  return <div ref={sketchRef} />;
}
