import { IDsArray } from './index';

export default function range(
  ids: IDsArray,
  coords: Float64Array,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  nodeSize: number,
): number[] {
    const stack: number[] = [0, ids.length - 1, 0];
    const result = [];

    // recursively search for items in range in the kd-sorted arrays
    while (stack.length) {
        const axis = stack.pop()!;
        const right = stack.pop()!;
        const left = stack.pop()!;

        // if we reached "tree node", search linearly
        if (right - left <= nodeSize) {
            for (let i = left; i <= right; i++) {
                const x = coords[2 * i];
                const y = coords[2 * i + 1];
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[i]);
            }
            continue;
        }

        // otherwise find the middle index
        const m = (left + right) >> 1;

        // include the middle item if it's in range
        const x = coords[2 * m];
        const y = coords[2 * m + 1];
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) result.push(ids[m]);

        // queue search in halves that intersect the query
        if (axis === 0 ? minX <= x : minY <= y) {
            stack.push(left);
            stack.push(m - 1);
            stack.push(1 - axis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
            stack.push(m + 1);
            stack.push(right);
            stack.push(1 - axis);
        }
    }

    return result;
}
