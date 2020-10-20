import { Position } from 'geojson';

import sort from './sort';
import range from './range';
import within from './within';

export type GetterFn = (p: Position) => number;
export type IDsArray = Uint16Array|Uint32Array;

function defaultGetX(p: Position): number {
  return p[0];
}
function defaultGetY(p: Position): number {
  return p[1];
}

export default class KDBush {
  nodeSize: number;

  points: Position[];

  ids: IDsArray;

  coords: Float64Array;

  constructor(
    points: Position[],
    getX: GetterFn = defaultGetX,
    getY: GetterFn = defaultGetY,
    nodeSize: number = 64,
    ArrayType = Float64Array,
  ) {
    this.nodeSize = nodeSize;
    this.points = points;

    const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

    // store indices to the input array and coordinates in separate typed arrays
    const ids = new IndexArrayType(points.length);
    this.ids = ids;
    const coords = new ArrayType(points.length * 2);
    this.coords = coords;

    for (let i = 0; i < points.length; i++) {
      ids[i] = i;
      coords[2 * i] = getX(points[i]);
      coords[2 * i + 1] = getY(points[i]);
    }

    // kd-sort both arrays for efficient search (see comments in sort.js)
    sort(ids, coords, nodeSize, 0, ids.length - 1, 0);
  }

  range(minX: number, minY: number, maxX: number, maxY: number): number[] {
    return range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
  }

  within(x: number, y: number, r: number): number[] {
    return within(this.ids, this.coords, x, y, r, this.nodeSize);
  }
}
