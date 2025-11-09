import { IncomingMessage } from 'http';
import { parse } from 'url';

export const getUserId = (req: IncomingMessage): string => {
  const { pathname } = parse(req.url || '', true);

  const urlList = (pathname ?? '')
    .split('/')
    .reduce<string[]>((acc, val) => (val ? (acc.push(val), acc) : acc), []);

  return urlList.slice(2).join('');
};
