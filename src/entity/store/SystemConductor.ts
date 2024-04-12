export class SystemConductor {
  id: string;
  name: string;
  login: string;
  password: string;

  constructor(id: string, name: string, login: string, password: string) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  checkPassword(pass: string): boolean {
    return this.password === pass;
  }
}
