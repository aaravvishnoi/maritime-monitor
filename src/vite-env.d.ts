/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AISSTREAM_API_KEY?: string;
  readonly VITE_AISHUB_USERNAME?: string;
  readonly VITE_DATADOCKED_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
