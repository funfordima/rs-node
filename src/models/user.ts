import { randomUUID } from 'crypto';

export class User {
  constructor(
    opt: Partial<User> = {},
    public id: string = opt.id ?? randomUUID(),
    public username: string = opt.username ?? '',
    public age: number | null = opt.age ?? null,
    public hobbies: string[] = opt.hobbies ?? [],
  ) { }
}
