import { env } from 'process';

const parseEnv = () => {
  const prefix = 'RSS_';
  const results = [];

  for (const key in env) {
    if (key.startsWith(prefix)) {
      results.push(`${key} = ${env[key]}`);
    }
  }

  console.log(results.join('; '))
};

parseEnv();
