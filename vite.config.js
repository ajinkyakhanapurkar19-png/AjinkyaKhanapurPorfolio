import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
 root:'app', base:'./', publicDir:'../public',
 build:{ outDir:'../dist', emptyOutDir:true, assetsDir:'bundles', target:'es2022', sourcemap:false,
  rollupOptions:{input:{portfolio:resolve(import.meta.dirname,'app/index.html'),caseStudy:resolve(import.meta.dirname,'app/case-study.html'),contentHubCase:resolve(import.meta.dirname,'app/content-hub-case-study.html'),vrCase:resolve(import.meta.dirname,'app/vr-case-study.html'),shotgunCase:resolve(import.meta.dirname,'app/shotgun-case-study.html'),pristineForestsCase:resolve(import.meta.dirname,'app/pristine-forests-case-study.html'),gscCase:resolve(import.meta.dirname,'app/gsc-case-study.html'),artistStudioCase:resolve(import.meta.dirname,'app/artist-studio-case-study.html')}} },
 server:{fs:{allow:['..']}}
});
