// This provide types for Node's fetch api.

export { }

declare global {
  export const {
    fetch,
    FormData,
    Headers,
    Request,
    Response
  }: typeof import('undici')
}