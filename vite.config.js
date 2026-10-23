import { defineConfig } from 'vite';
export default defineConfig({
 root:'app', base:'./', publicDir:false,
 build:{ outDir:'../dist', emptyOutDir:true, assetsDir:'bundles', target:'es2022', sourcemap:false },
 server:{fs:{allow:['..']}}
});
