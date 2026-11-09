/**
 * Modo da barra de progresso (mesmos modos do Angular Material).
 * - `determinate`: progresso conhecido, controlado por `value`.
 * - `indeterminate`: progresso desconhecido, animação contínua.
 * - `buffer`: `value` + `bufferValue` (ex.: carregamento de mídia).
 * - `query`: indeterminado com animação invertida (ex.: aguardando resposta antes de um determinate).
 */
export type CaoProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';