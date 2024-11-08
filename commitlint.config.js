module.exports = {
  // 继承常规的提交信息规则
  extends: ["@commitlint/config-conventional"],

  // 自定义规则
  rules: {
    // 主类型（type）必须是以下之一
    "type-enum": [
      2,
      "always",
      [
        "build", // 构建系统或外部依赖的更改
        "ci", // CI 配置文件和脚本的更改
        "docs", // 文档的更改
        "feat", // 新功能
        "fix", // 修复 bug
        "perf", // 性能优化
        "refactor", // 重构代码
        "revert", // 回滚之前的提交
        "style", // 不影响程序运行的样式更改
        "test", // 添加或更新测试
        "chore" // 构建过程或辅助工具的更改
      ]
    ],

    // 类型（type）不能为空
    "type-empty": [2, "never", true],

    // 主题（subject）不能为空
    "subject-empty": [2, "never", true]
  }
}
