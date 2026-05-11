// SparkLocal Open Badges 3.0 — Key Provider abstraction.
//
// V1 reads the signing key from a Vite-injected env var so the prototype can
// issue real W3C Verifiable Credentials end-to-end without a backend. V2+
// swaps this for a KMS-backed implementation (AWS KMS, HashiCorp Vault) by
// providing a different `KeyProvider` via `setKeyProvider()`.
//
// Module load is intentionally side-effect-free: env vars are read lazily
// inside `getActiveSigningKey()`, so the app boots cleanly when keys are not
// configured — errors only surface when someone tries to issue or verify.

export interface SigningKeyPair {
  publicKeyMultibase: string
  privateKeyMultibase: string
  keyId: string // The verificationMethod identifier
  controller: string // The DID that controls this key
}

export interface KeyProvider {
  getActiveSigningKey(): Promise<SigningKeyPair>
  getVerificationKey(keyId: string): Promise<{ publicKeyMultibase: string; controller: string }>
}

class EnvVarKeyProvider implements KeyProvider {
  async getActiveSigningKey(): Promise<SigningKeyPair> {
    const privateKey = import.meta.env.VITE_OB_SIGNING_KEY_PRIVATE
    const publicKey = import.meta.env.VITE_OB_SIGNING_KEY_PUBLIC
    const issuerDid = import.meta.env.VITE_OB_ISSUER_DID

    if (!privateKey || !publicKey || !issuerDid) {
      throw new Error(
        'Open Badges signing not configured. Set VITE_OB_SIGNING_KEY_PRIVATE, ' +
          'VITE_OB_SIGNING_KEY_PUBLIC, VITE_OB_ISSUER_DID. ' +
          'Run `npm run generate:ob-keys` to create a dev key pair.',
      )
    }

    return {
      publicKeyMultibase: publicKey,
      privateKeyMultibase: privateKey,
      keyId: `${issuerDid}#key-1`,
      controller: issuerDid,
    }
  }

  async getVerificationKey(keyId: string) {
    const key = await this.getActiveSigningKey()
    if (key.keyId !== keyId) {
      throw new Error(`Verification key ${keyId} not found`)
    }
    return { publicKeyMultibase: key.publicKeyMultibase, controller: key.controller }
  }
}

let _provider: KeyProvider = new EnvVarKeyProvider()

export function getKeyProvider(): KeyProvider {
  return _provider
}

// For tests and future KMS migration.
export function setKeyProvider(provider: KeyProvider): void {
  _provider = provider
}
