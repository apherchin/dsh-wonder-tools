# dsh-wonder-tools

[English](README.md) | 中文

**一个插件卡，五个功能，每行都能独立开关。**

`dsh-wonder-tools` 是 DeepSeek Harness（DSH）的**装配包**：它的 patch 声明五行组件，
插件页因此呈现为**一张卡片 + 五行组件**，每行一个开关 —— 不用在五个插件条目里来回找。

| 行（组件） | 由哪个包提供 | 作用 |
|---|---|---|
| 删除对话 | `@apherchin/dsh-session-delete` | 会话右键菜单：**删除对话** / **复制会话 ID**。真删磁盘数据、级联删除派生的子代理会话、活跃会话一律拒绝。 |
| 重新生成（从这里重来） | `@apherchin/dsh-session-rewind` | 助手动作行：把该轮及之后从模型视野里作废，原提示词回填输入框，并提供"分支找回"。 |
| 队友命令 | `dsh-sidefork-a-teammate` | `/teammate` 两种模式：全新队友（不继承上下文）或 fork 队友（并行分支，继承已完成回合）。需要 Agent Teams 组合包。 |
| 跨会话提醒 | `dsh-windows-session-notification` | 会话完成 / 待审批 / 向你提问、而你没在看它时，弹 Windows 通知 + 分档音 + 任务栏角标。**仅 Windows。** |
| 首轮结束自动命名 | `dsh-rename-title-after-first-turn` | 主会话跑完第一轮后用"首轮问答"自动命名一次；host-only，无界面元素。同时关掉官方 first-prompt provider（它只有 64 token，在 pi-ai 路由上会被 reasoning 吃光）。 |

## 安装

```bash
# 一条命令：装配包已把这 5 个功能包声明为依赖
dsh plugin --profile <profile> add dsh-wonder-tools
```

装完**整机重启 DSH**（打包版没有"刷新页面"）。

单个功能的开关：用卡片上每一行自己的开关，或在 profile 补丁里改
（`~/.dsh/profiles/<profile>/cordis.patch.yml`）。

## 它是怎么工作的

本包**不含功能逻辑**：`cordis.patch.yml` 声明五行，每行指向一个独立功能包；
DSH 把每个包当作一个 loader 行加载 ⇒ 面板就是"一张卡 + 五行"。host-only 的包（自动命名）
不参与渲染端"每条 client entry 必须 active"的全有全无门禁。

## 三条硬约束（违反会整机起不来）

1. **行的包名必须与该包 client bundle 注册的 id 完全一致**（`window.__ModuleLoader__.load({ id })`）——
   2026-10-04 那两次启动崩溃就是这里不一致；
2. 这 5 个功能包是**依赖**，绝不能出现在 `dsh.profile.bundles` 里（否则各成一张卡）；
   这也是它们不再声明 `dsh.bundle.patch` 的原因；
3. 每一行的 client bundle 都必须能激活，否则渲染端启动门禁会让整页失败。

离线预检（把上面三条都断言了一遍）：

```bash
node work/merge-plugins-20261004/a2-staging/verify-a2-composition.mjs <本包目录> <profile 目录>
```

## License

MIT