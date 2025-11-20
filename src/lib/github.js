// Re-export TypeScript implementation explicitly to avoid resolution cycles.
// Point directly at the TS file so bundlers don't accidentally resolve this file
// back to itself when doing extensionless resolution.
export * from './github.ts';
