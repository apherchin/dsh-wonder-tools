# dsh-wonder-tools

DSH **工具箱（装配包）**：一个 bundle 装好**五个功能**，在插件页呈现为 **1 张卡片 + 5 行组件**，
**每一行都能独立开关**。

| 行（组件） | 由哪个包提供 | 开关 |
|---|---|---|
| 删除对话 | `@apherchin/dsh-session-delete` | 该行在面板里的开关 |
| 重新生成（从这里重来） | `@apherchin/dsh-session-rewind` | 同上 |
| 队友命令（`/teammate`） | `dsh-sidefork-a-teammate` | 同上（需要 Agent Teams 组合包） |
| 跨会话提醒 | `dsh-windows-session-notification` | 同上（**仅 Windows**） |
| 首轮结束自动命名 | `dsh-rename-title-after-first-turn` | 同上（host-only，无界面元素） |

## 它是怎么工作的

本包**不含功能逻辑**：`cordis.patch.yml` 声明 5 行，每行指向一个独立功能包；
DSH 把每个包当作一个 loader 行加载 ⇒ 面板上就是"一张卡 + 5 行"，每行一个开关。

⚠️ 三条硬约束（违反会整机起不来或形态不对）：

1. **每行的包名必须与该包 client bundle 里 `window.__ModuleLoader__.load({ id })` 的 id 完全一致**
   （2026-10-04 两次启动崩溃的根因就是这个 id 没跟包名改）；
2. 那 5 个包要装在 profile 的 `node_modules`（依赖），但**不能**写进 `dsh.profile.bundles`
   —— 否则它们各成一张卡，就不是"1 卡 + 5 行"了（`dsh plugin add` 会自动塞进 bundles，装完要摘掉）；
3. host-only 的包（如 `dsh-rename-title-after-first-turn`）不参与渲染端「每条 client entry 必须 active」的门禁；
   带 client 半边的包则**必须**能激活。

## 安装

```bash
# 1) 先装 5 个功能包（当前它们尚未全部发布到 npm：title 包与 rewind 的修复版需要先发）
dsh plugin --profile <profile> add @apherchin/dsh-session-delete
dsh plugin --profile <profile> add @apherchin/dsh-session-rewind     # 需要含 id 修复的 0.1.1
dsh plugin --profile <profile> add dsh-sidefork-a-teammate
dsh plugin --profile <profile> add dsh-windows-session-notification
dsh plugin --profile <profile> add dsh-rename-title-after-first-turn

# 2) 再把它们从 dsh.profile.bundles 里摘掉（保留为依赖），只留本装配包

# 3) 装本装配包
dsh plugin --profile <profile> add dsh-wonder-tools

# 4) 整机重启 DSH
```

## 离线校验

```bash
node work/merge-plugins-20261004/a2-staging/verify-a2-composition.mjs <本包目录> <profile 目录> [真实 profile 目录]
```

它会逐行断言：裸包名、包可解析、描述/入口齐全、client 脚本可解析、
**client id === 包名**、无重复包、5 个包不在 `dsh.profile.bundles`、真 profile 补丁无旧声明。

## License

MIT