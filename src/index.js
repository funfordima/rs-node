import readline from 'readline';

const init = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '-->',
  });

  const userName = 'Dima';

  rl.question(`Welcome to the File Manager, ${userName}! \n You are currently in ${process.cwd()}`, (input) => {
    if (input === '.exit') {
      rl.close();
      return;
    }
  });

  rl.on('line', (input) => {
    if (input === '.exit') {
      rl.close();
      return;
    }
  }); 

  rl.on('SIGINT', () => rl.close());

  rl.on('close', () => {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  });
};

init();
