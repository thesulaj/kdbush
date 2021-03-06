import { Position } from 'geojson';

import sort from './sort';
import range from './range';
import within from './within';

export type GetterFn<A = Position> = (p: A) => number;
export type IDsArray = Uint16Array|Uint32Array;

export default class KDBush<A = Position> {
  nodeSize: number;

  ids: IDsArray;

  coords: Float64Array;

  constructor(
    points: A[],
    getX: GetterFn<A>,
    getY: GetterFn<A>,
    nodeSize: number = 64,
  ) {
    this.nodeSize = nodeSize;

    const IndexArrayType = points.length < 65536 ? Uint16Array : Uint32Array;

    // store indices to the input array and coordinates in separate typed arrays
    const ids = new IndexArrayType(points.length);
    this.ids = ids;
    const coords = new Float64Array(points.length * 2);
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
