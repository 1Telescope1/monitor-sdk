import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'index.ts',
    output: [
      {
        dir: 'lib',
        format: 'esm', // 选择 ESM 格式
        entryFileNames: '[name].esm.js',
        sourcemap: false,
      },
      {
        dir: 'lib',
        format: 'cjs', // 选择 CJS 格式
        entryFileNames: '[name].cjs.js',
        sourcemap: false,
      },
    ],
    plugins: [
      peerDepsExternal(), // 排除 peerDependencies
      typescript({ module: 'ESNext', sourceMap: false }), // 模块的输出格式为 ESNext
      commonjs(), // 处理 cjs 模块
      terser(), // 压缩代码
      resolve(), // 解析第三方依赖
    ],
    external: ['react', 'react-dom'], // 声明外部依赖
  },
]
