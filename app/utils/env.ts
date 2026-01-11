export function getPublicEnv(
  key: string,
  defaultValue?: string
): string | undefined {
  const runtimeKey = `__APEMIGOS_${key}`;

  const runtime =
    typeof window !== 'undefined'
      ? (globalThis as any)[runtimeKey] ?? (window as any)[runtimeKey]
      : undefined;

  const buildPublic =
    typeof process !== 'undefined'
      ? (process.env[`NEXT_PUBLIC_${key}` as keyof NodeJS.ProcessEnv] as
          | string
          | undefined)
      : undefined;

  const buildPrivate =
    typeof process !== 'undefined'
      ? (process.env[key as keyof NodeJS.ProcessEnv] as string | undefined)
      : undefined;

  return runtime ?? buildPublic ?? buildPrivate ?? defaultValue;
}
