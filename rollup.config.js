const resolve = require("@rollup/plugin-node-resolve")
const typescript = require("@rollup/plugin-typescript")
const commonjs = require("@rollup/plugin-commonjs")
const peerDepsExternal = require("rollup-plugin-peer-deps-external")

module.exports = [
  {
    input: "index.ts",
    output: [
      {
        dir: "lib",
        format: "cjs",
        entryFileNames: "[name].cjs.js",
        sourcemap: false
      },
      {
        dir: "lib",
        format: "esm",
        entryFileNames: "[name].esm.js",
        sourcemap: false
      }
    ],
    plugins: [
      peerDepsExternal(), // 排除 peerDependencies
      typescript({ module: "ESNext", sourceMap: false }), // 模块的输出格式为 ESNext
      commonjs(), // 处理cjs使它们可以在esm环境使用
      resolve(), // 处理第三方模块的路径解析
    ],
    external: ['react', 'react-dom'], // 声明外部依赖
  }
]
