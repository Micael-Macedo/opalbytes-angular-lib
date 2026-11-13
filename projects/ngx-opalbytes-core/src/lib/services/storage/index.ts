/**
 * @module infrastructure/storage
 *
 * @description
 * Serviços de persistência local — wrappers tipados sobre mecanismos de storage
 * do browser. Exemplos esperados:
 *
 * - `storage.service.ts` — abstração sobre `localStorage`/`sessionStorage` com serialização JSON
 * - `cookie.service.ts` — leitura e escrita de cookies HTTP-only e de aplicação
 *
 * @rule Nenhuma lógica de negócio aqui — apenas persistência e leitura.
 *       Use tipos genéricos para evitar acoplamento com modelos de domínio.
 * @layer infrastructure — consumido por application/services e infrastructure/
 */

export * from "./storage.service";
export * from "./local-storage.service";
export * from "./session-storage.service";
