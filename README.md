# dsh-wonder-tools

English | [中文](README.zh.md)

**One plugin card in DSH, five features, each with its own toggle.**

`dsh-wonder-tools` is an **assembly bundle** for DeepSeek Harness (DSH):
its patch declares five component rows, so the Plugins page renders **one card with five
independently switchable rows** — no more hunting through five separate plugin entries.

| Row (component) | Provided by | What it does |
|---|---|---|
| Delete conversation | `@apherchin/dsh-session-delete` | Session context menu: **Delete conversation** / **Copy session ID**. Really deletes disk data, cascades into spawned subagent sessions, refuses live sessions. |
| Rewind from here | `@apherchin/dsh-session-rewind` | Assistant action row: erases that turn and everything after it from the model's view, puts the original prompt back in the composer, with a "branch recovery" option. |
| Teammate commands | `dsh-sidefork-a-teammate` | `/teammate` in two modes — a fresh teammate (inherits nothing) or a fork teammate (parallel branch, inherits completed turns). Needs the Agent Teams bundle. |
| Cross-session attention | `dsh-windows-session-notification` | Windows toast + tiered sound + taskbar badge when a session finished / needs approval / asks you something and you are **not** watching it. **Windows only.** |
| Auto-title after first turn | `dsh-rename-title-after-first-turn` | Names the main session once from its first Q+A. Host-only (no UI). Also disables the official first-prompt provider, whose 64-token budget is eaten by reasoning on pi-ai routes. |

## Install

```bash
# one command: the assembly declares the five feature packages as dependencies
dsh plugin --profile <profile> add dsh-wonder-tools
```

Then **restart DSH** (the packaged desktop app has no "reload page").

Per-feature switches: use each row's toggle on the card, or flip them in the profile patch
(`~/.dsh/profiles/<profile>/cordis.patch.yml`).

## How it works

This package contains **no feature logic**. Its `cordis.patch.yml` declares five rows, each naming
a package; DSH loads each package as a loader row, so the panel shows one card + five rows.
Host-only packages (auto-title) stay out of the renderer's all-or-nothing boot gate.

## Invariants (violating these bricks the whole app)

1. **A row's package name must equal the `id` its client bundle registers**
   (`window.__ModuleLoader__.load({ id })`). The 2026-10-04 boot crashes were exactly this mismatch.
2. The five feature packages are **dependencies**, never entries in `dsh.profile.bundles`
   (otherwise each becomes its own card). That is why they no longer declare `dsh.bundle.patch`.
3. A row's client bundle must activate, or the renderer boot gate fails the whole page.

Offline preflight (asserts all of the above):

```bash
node work/merge-plugins-20261004/a2-staging/verify-a2-composition.mjs <this package> <profile dir>
```

## License

MIT