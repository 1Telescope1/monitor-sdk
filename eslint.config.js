// 引入必要的 ESLint 插件和解析器
const js = require("@eslint/js") // ESLint 的基础 JS 配置
const tsPlugin = require("@typescript-eslint/eslint-plugin") // TypeScript ESLint 插件
const tsParser = require("@typescript-eslint/parser") // TypeScript 解析器
const prettierPlugin = require("eslint-plugin-prettier") // Prettier 插件，用于格式化代码

module.exports = [
  // 基本的 ESLint 推荐配置
  js.configs.recommended,

  // 自定义 TypeScript 配置
  {
    files: ["src/**/*.{js,ts}"], // 只对 src 目录下的 js 和 ts 文件应用此配置
    languageOptions: {
      parser: tsParser, // 使用 TypeScript 解析器
      parserOptions: {
        ecmaVersion: "latest", // 使用最新的 ECMAScript 版本
        sourceType: "module" // 代码类型设为 module 以支持 import/export 语法
      },
      globals: {
        // 手动声明一些浏览器中的全局对象为只读，避免 no-undef 报错
        window: "readonly",
        console: "readonly",
        PerformanceObserver: "readonly",
        PerformanceEntry: "readonly",
        PerformanceObserverEntryList: "readonly",
        document: "readonly",
        PerformanceResourceTiming: "readonly",
        performance: "readonly",
        XMLHttpRequest: "readonly",
        URL: "readonly",
        Request: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        Event: "readonly",
        HTMLScriptElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLScriptElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLLinkElement: "readonly",
        PromiseRejectionEvent: "readonly",
        Image: "readonly",
        setTimeout: "readonly",
        setTimeout: "readonly",
        HTMLElement: "readonly",
        XMLHttpRequestBodyInit: "readonly",
        Document: "readonly",
        Window: "readonly",
        ErrorEvent: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin, // 启用 TypeScript ESLint 插件
      prettier: prettierPlugin // 启用 Prettier 插件
    },
    rules: {
      // 自定义 ESLint 规则
      "no-unused-vars": "warn", // 未使用的变量仅提示警告，不报错
      "no-console": "off", // 允许使用 console.log
      "@typescript-eslint/no-explicit-any": "off", // 允许使用 any 类型
      "@typescript-eslint/no-this-alias": "off", // 允许为 this 创建别名
      "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言（即 ! 操作符）
      "@typescript-eslint/no-unused-vars": ["warn"], // TypeScript 的未使用变量也仅提示警告
      "prettier/prettier": [
        "error",
        {
          // 配置 Prettier 的格式化选项
          semi: false, // 不使用分号
          trailingComma: "none", // 禁止使用拖尾逗号
          arrowParens: "avoid", // 单参数箭头函数不使用括号
          singleQuote: true, // 使用单引号
          endOfLine: "auto" // 根据文件的换行符自动调整
        }
      ],
      // 其他常用代码规范规则
      curly: ["error", "all"], // 所有控制语句都需加括号
      "no-var": "error", // 禁止使用 var，建议用 let 和 const
      "prefer-const": "warn", // 如果变量不会被重新赋值，建议使用 const
      "object-shorthand": ["error", "always"], // 对象字面量强制使用简写语法
      "array-callback-return": "error", // 确保数组方法中的回调函数有返回值
      "no-duplicate-imports": "error", // 禁止重复导入相同模块
      "no-multi-spaces": "error", // 禁止多个空格
      // "space-before-function-paren": ["error", "never"], // 函数括号前不允许有空格
      "comma-dangle": ["error", "never"] // 禁止使用拖尾逗号
    }
  }
]
