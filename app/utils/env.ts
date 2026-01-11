// Helper para resolver variáveis de ambiente públicas com possibilidade de override em runtime
// Ordem de resolução (browser): window.__APEMIGOS_<KEY> -> process.env.NEXT_PUBLIC_<KEY> -> default
// Em server/build-time (Node) apenas process.env.NEXT_PUBLIC_<KEY> -> default

export function getPublicEnv(
  key: string,
  defaultValue?: string
): string | undefined {
  const runtimeKey = `__APEMIGOS_${key}`;

  const runtime =
    typeof window !== 'undefined'
      ? (globalThis as any)[runtimeKey] ?? (window as any)[runtimeKey]
      : undefined;

  const build =
    typeof process !== 'undefined'
      ? (process.env[`NEXT_PUBLIC_${key}` as keyof NodeJS.ProcessEnv] as
          | string
          | undefined)
      : undefined;

  return runtime ?? build ?? defaultValue;
}
