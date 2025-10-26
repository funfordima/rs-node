import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { cpus } from 'node:os';

import { getFilePath } from '../helpers/getFilePath.js';

const performCalculations = async () => {
  const fileName = 'worker.js';
  const filePath = path.resolve(getFilePath(import.meta.url), fileName);

  const workerList = [];

	const resultList = cpus().map((_, i) => {
		return new Promise((resolve, reject) => {
			const worker = new Worker(filePath);
	
			workerList.push(worker);
			worker.postMessage(10 + i);
			worker.on('message', (data) => resolve({ status: 'resolved', data }));
			worker.on('error', () => resolve({ status: 'error', data: null }));
			worker.on('exit', (code) => {
				if (code !== 0)
					reject(new Error(`Worker stopped with exit code ${code}`));
			});
		});
	});

	const result = (await Promise.all(resultList)).map((item) => `${JSON.stringify(item)}`);
	workerList.forEach((worker) => worker.terminate());
	console.log(result);
};

await performCalculations();
