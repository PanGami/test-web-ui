/// <reference types="vite/client" />

// Allow CSS module imports
declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}
