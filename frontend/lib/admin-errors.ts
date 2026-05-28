export function formatApiError(err: unknown, fallback = "Something went wrong."): string {
  if (!(err instanceof Error)) return fallback;
  return err.message || fallback;
}

export async function parseApiErrorResponse(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({}));
  if (Array.isArray(body?.details) && body.details.length > 0) {
    return body.details
      .map((d: { field?: string; message?: string }) =>
        d.field ? `${d.field}: ${d.message}` : d.message
      )
      .join("; ");
  }
  return body?.error || body?.message || `Request failed (${res.status})`;
}

export function throwApiError(message: string): never {
  throw new Error(message);
}
