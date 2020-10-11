class Logger {
  constructor() {
    this.enabled = false;
    ['log', 'warn', 'info', 'error'].forEach((method) => {
      this[method] = (...args) => {
        if (this.enabled) {
          // eslint-disable-next-line no-console
          console[method](...args);
        }
      };
    });
  }
}

const logger = new Logger();
window.logger = logger;

export default logger;
