const resolve = require("@rollup/plugin-node-resolve")
const typescript = require("@rollup/plugin-typescript")
const commonjs = require("@rollup/plugin-commonjs")
const peerDepsExternal = require("rollup-plugin-peer-deps-external")
const { terser } = require("rollup-plugin-terser")

module.exports = [
  {
    input: "index.ts",
    output: [
      {
        dir: "lib",
        format: "cjs",
        entryFileNames: "[name].cjs.js",
        sourcemap: false // 是否输出sourcemap
      },
      {
        dir: "lib",
        format: "esm",
        entryFileNames: "[name].esm.js",
        sourcemap: false // 是否输出sourcemap
      },
      {
        dir: "lib",
        format: "umd",
        entryFileNames: "[name].umd.js",
        name: "FE_utils", // umd模块名称，相当于一个命名空间，会自动挂载到window下面
        sourcemap: false,
        plugins: [terser()]
      }
    ],
    plugins: [
      peerDepsExternal(), // 排除 peerDependencies
      typescript({ module: "ESNext" }), // 模块的输出格式为 ESNext
      commonjs(), // 处理cjs使它们可以在esm环境使用
      resolve(), // 处理第三方模块的路径解析
    ],
    external: ['react', 'react-dom'], // 声明外部依赖
  }
]
