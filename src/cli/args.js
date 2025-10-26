import { argv } from 'process';

const parseArgs = () => {
  const prefix = '--';
  const result = [];

  for (let i = 2; i < argv.length; i += 2) {
    if (argv[i].startsWith(prefix)) {
      result.push(`${argv[i]} is ${argv[i + 1]}`);
    }
  }

  console.log(result.join(', '));
};

parseArgs();
