export interface ZeroDBQueryResult<T = Record<string, unknown>> {
  rows: T[];
}

export interface ZeroDBClient {
  query<T = Record<string, unknown>>(
    table: string,
    filters: Record<string, unknown>,
    options?: { orderBy?: string; limit?: number }
  ): Promise<ZeroDBQueryResult<T>>;
}

/**
 * Returns a ZeroDBClient instance.
 * This is a placeholder that returns a stub client. The real implementation
 * will connect to ZeroDB using project credentials.
 */
export function getClient(): ZeroDBClient {
  return {
    async query() {
      return { rows: [] };
    },
  };
}
