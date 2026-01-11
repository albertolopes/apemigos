export function getPublicEnv(
  key: string,
  defaultValue?: string
): string | undefined {
  // Allow callers to pass either 'API_URL' or 'NEXT_PUBLIC_API_URL'
  const normalizedKey = key.startsWith('NEXT_PUBLIC_')
    ? key
    : `NEXT_PUBLIC_${key}`;

  const runtimeKey = `__APEMIGOS_${key}`;

  // Check runtime-injected globals (useful for runtime config overrides)
  const runtime =
    typeof globalThis !== 'undefined'
      ? (globalThis as any)[runtimeKey] ?? (typeof window !== 'undefined' ? (window as any)[runtimeKey] : undefined)
      : undefined;

  // Build-time public env (exposed to client)
  const buildPublic =
    typeof process !== 'undefined'
      ? (process.env[normalizedKey as keyof NodeJS.ProcessEnv] as string | undefined)
      : undefined;

  // Server-side/private env (available only on server/runtime)
  const buildPrivate =
    typeof process !== 'undefined'
      ? (process.env[key as keyof NodeJS.ProcessEnv] as string | undefined)
      : undefined;

  // Also accept direct NEXT_PUBLIC_* when caller passed that explicitly
  const directNextPublic =
    typeof process !== 'undefined' && key.startsWith('NEXT_PUBLIC_')
      ? (process.env[key as keyof NodeJS.ProcessEnv] as string | undefined)
      : undefined;

  return (
    runtime ?? directNextPublic ?? buildPublic ?? buildPrivate ?? defaultValue
  );
}
