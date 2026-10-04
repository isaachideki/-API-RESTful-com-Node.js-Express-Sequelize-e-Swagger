declare module 'swagger-jsdoc' {
  export interface Options {
    definition?: Record<string, unknown>;
    apis?: string[];
    [key: string]: unknown;
  }

  function swaggerJsdoc(options: Options): Record<string, unknown>;
  export default swaggerJsdoc;
}
