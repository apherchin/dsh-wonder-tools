/**
 * dsh-wonder-tools —— **装配包**的入口。
 *
 * 本包不含任何功能逻辑：5 个功能由 `cordis.patch.yml` 声明的 5 行各自的包提供
 * （每行在面板里是一个可独立开关的组件行）。
 *
 * 保留这个入口只为满足 `exports["."]`；该 bundle 本身不是一个 loader 行，
 * 因此这个模块在正常运行中**不会被加载**。
 */
export const name = 'wonder-tools'

export const inject = []

export function apply() {
	/* 装配包没有自身逻辑：功能由 5 个子包各自 apply。 */
}