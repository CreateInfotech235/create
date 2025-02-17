declare type StaticOrigin =
  | boolean
  | string
  | RegExp
  | Array<boolean | string | RegExp>;

declare type Transport = 'polling' | 'websocket';

interface CorsOptions {
  /**
   * @default '*''
   */
  origin?: StaticOrigin;
}

declare type socketConfig = {
  path: string;
  transports: Array<Transport>;
  secure: boolean;
  cors: CorsOptions;
};

export default socketConfig;
