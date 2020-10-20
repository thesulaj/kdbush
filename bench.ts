/* eslint-disable no-console */
import * as v8 from 'v8';
import KDBush from './src/index';

const randomInt = (max: number) => Math.floor(Math.random() * max);
const randomPoint = (max: number) => [randomInt(max), randomInt(max)];
const heapSize = () => `${v8.getHeapStatistics().used_heap_size / 1000} KB`;

const points = [];
for (let i = 0; i < 1000000; i++) points.push(randomPoint(1000));

console.log(`memory: ${heapSize()}`);

console.time(`index ${points.length} points`);
const index = new KDBush(points, undefined, undefined, 64);
console.timeEnd(`index ${points.length} points`);

console.log(`memory: ${heapSize()}`);

console.time('10000 small bbox queries');
for (let i = 0; i < 10000; i++) {
  const p = randomPoint(1000);
  index.range(p[0] - 1, p[1] - 1, p[0] + 1, p[1] + 1);
}
console.timeEnd('10000 small bbox queries');

console.time('10000 small radius queries');
for (let i = 0; i < 10000; i++) {
  const p = randomPoint(1000);
  index.within(p[0], p[1], 1);
}
console.timeEnd('10000 small radius queries');
