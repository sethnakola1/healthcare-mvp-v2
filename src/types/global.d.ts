// TypeScript declaration file for better type safety
// src/types/global.d.ts
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export {};