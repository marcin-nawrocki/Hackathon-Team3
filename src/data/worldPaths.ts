import world from './countries.geo.json';

// Convert the world GeoJSON into SVG path strings in an equirectangular
// viewBox of 360 x 180, where x = lon + 180 and y = 90 - lat. The country
// bubbles use the same linear projection, so everything stays aligned.

type Ring = number[][];

function ringToPath(ring: Ring): string {
  let d = '';
  for (let i = 0; i < ring.length; i++) {
    const lon = ring[i][0];
    const lat = ring[i][1];
    const x = lon + 180;
    const y = 90 - lat;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

function featureToPath(geometry: any): string {
  if (!geometry) return '';
  if (geometry.type === 'Polygon') {
    return (geometry.coordinates as Ring[]).map(ringToPath).join(' ');
  }
  if (geometry.type === 'MultiPolygon') {
    const parts: string[] = [];
    for (const poly of geometry.coordinates as Ring[][]) {
      for (const ring of poly) parts.push(ringToPath(ring));
    }
    return parts.join(' ');
  }
  return '';
}

export const COUNTRY_PATHS: string[] = (world as any).features
  .map((f: any) => featureToPath(f.geometry))
  .filter((d: string) => d.length > 0);
