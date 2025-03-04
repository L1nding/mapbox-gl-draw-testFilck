const { MINIFY } = process.env;
const minified = MINIFY === 'true';
const outputFile = 'dist/index.js';
import dts from 'rollup-plugin-dts';  // 导入 rollup-plugin-dts
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [{
  input: ['index.js'],
  output: {
    name: 'MapboxDraw',
    file: outputFile,
    // format: 'umd',
    format: 'esm',  // 修改为 ES6 模块格式
    sourcemap: true,
    indent: false
  },
  treeshake: true,
  plugins: [
    minified ? terser({
      ecma: 2020,
      module: true,
    }) : false,
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    commonjs({
      // global keyword handling causes Webpack compatibility issues, so we disabled it:
      // https://github.com/mapbox/mapbox-gl-js/pull/6956
      ignoreGlobal: true
    })
  ],
}, // 生成类型声明文件
{
  input: 'src/index.d.ts',  // 输入你的主 JS 文件
  output: {
    file: 'dist/index.d.ts',  // 输出 .d.ts 类型声明文件
    format: 'es',  // 使用 ESM 格式
  },
  plugins: [dts()]  // 使用 rollup-plugin-dts 插件来生成类型声明文件
}
];
