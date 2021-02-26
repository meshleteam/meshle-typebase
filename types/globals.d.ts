declare global {
  type _Buffer = Buffer | import("buffer/").Buffer;
}
export {};
