export class ConsoleSpy {
  public logs: string[] = [];

  error(...args: string[]): void {
    this.log(...args);
  }

  warn(...args: string[]): void {
    this.log(...args);
  }

  log(...args: string[]): void {
    this.logs.push(args.join(' '));
  }
}
