// Minimal ambient type declarations for the Digital Bazaar Verifiable
// Credentials packages, which ship no TypeScript types.
//
// We declare only the surface our credential issuer actually uses. If a
// future commit reaches for additional methods/properties, extend the
// shapes here — never resort to `any`.

declare module '@digitalbazaar/ed25519-verification-key-2020' {
  export class Ed25519VerificationKey2020 {
    id: string
    controller: string
    type: string
    publicKeyMultibase: string
    privateKeyMultibase?: string

    static generate(options?: unknown): Promise<Ed25519VerificationKey2020>

    static from(options: {
      id?: string
      controller?: string
      type?: string
      publicKeyMultibase: string
      privateKeyMultibase?: string
    }): Promise<Ed25519VerificationKey2020>
  }
}

declare module '@digitalbazaar/ed25519-signature-2020' {
  import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'

  export class Ed25519Signature2020 {
    constructor(options?: { key?: Ed25519VerificationKey2020; verificationMethod?: string })
  }
}

declare module '@digitalbazaar/vc' {
  export interface DocumentLoaderResult {
    contextUrl: string | null
    document: unknown
    documentUrl: string
  }

  export type DocumentLoader = (url: string) => Promise<DocumentLoaderResult>

  interface IssueOptions {
    credential: Record<string, unknown>
    suite: unknown
    documentLoader: DocumentLoader
  }

  interface VerifyOptions {
    credential: Record<string, unknown>
    suite: unknown
    documentLoader: DocumentLoader
  }

  export interface VerifyResult {
    verified: boolean
    error?: { message?: string } | Error
    results?: unknown[]
  }

  export function issue(opts: IssueOptions): Promise<Record<string, unknown>>
  export function verifyCredential(opts: VerifyOptions): Promise<VerifyResult>
  export const defaultDocumentLoader: DocumentLoader
}
