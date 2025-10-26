import { Transform, Writable } from 'stream';
import { pipeline } from 'stream/promises';

const transform = async () => {
  const stdoutWrapper = new Writable({
    write(chunk, encoding, callback) {
      process.stdout.write(chunk, encoding, () => setImmediate(callback));
    }
  });

  const myTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, `${String(chunk).split('').reverse().join('')}\n`);
    },
  });

  try {
    await pipeline(
      process.stdin,
      myTransform,
      stdoutWrapper
    );

    process.stdout.write('\n');
  } catch (error) {
    console.log(error);
  }
};

await transform();
