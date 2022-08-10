import Pino, {
  stdSerializers,
  Bindings,
  Logger as PinoLogger,
  LoggerOptions,
} from "pino";

const Levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: Infinity,
};

const serializers = {
  error: stdSerializers.err,
  request: stdSerializers.req,
  response: stdSerializers.res,
};

export class Logger {
  readonly #logger: PinoLogger;

  public constructor(
    { level = Logger.getLevel(), ...options }: LoggerOptions = {},
    logger = Pino({ level, serializers, ...options })
  ) {
    this.#logger = logger;
  }

  public child(params: Bindings = {}): Logger {
    return new Logger({}, this.#logger.child(params));
  }

  public fatal(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.fatal(extra, message);
  }

  public error(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.error(extra, message);
  }

  public warn(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.warn(extra, message);
  }

  public info(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.info(extra, message);
  }

  public debug(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.debug(extra, message);
  }

  public trace(message: string, extra: Record<string, unknown> = {}): void {
    this.#logger.trace(extra, message);
  }

  public static get ENV_VARIABLE_NAME(): string {
    return "BINDEN_LOG_LEVEL";
  }

  public static getLevel(
    env_name = this.ENV_VARIABLE_NAME
  ): keyof typeof Levels {
    const {
      env: { [env_name]: LEVEL },
    } = process;

    const level = LEVEL?.trim().toLowerCase();

    switch (level) {
      case "trace":
      case "debug":
      case "info":
      case "warn":
      case "error":
      case "fatal":
        return level;
      default:
        return "silent";
    }
  }
}

export default new Logger({ level: Logger.getLevel() });
