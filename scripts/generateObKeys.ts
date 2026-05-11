// scripts/generateObKeys.ts
// Run with: npm run generate:ob-keys
// Outputs values to paste into .env.local. NEVER COMMIT THE PRIVATE KEY.

import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'

async function main() {
  const keyPair = await Ed25519VerificationKey2020.generate()
  const did = `did:key:${keyPair.publicKeyMultibase}`

  console.log('\n=== SparkLocal Open Badges Issuer Keys ===\n')
  console.log('Copy these to .env.local:\n')
  console.log(`VITE_OB_ISSUER_DID=${did}`)
  console.log(`VITE_OB_SIGNING_KEY_PUBLIC=${keyPair.publicKeyMultibase}`)
  console.log(`VITE_OB_SIGNING_KEY_PRIVATE=${keyPair.privateKeyMultibase}`)
  console.log('\nIssuer DID:', did)
  console.log('Key ID:', `${did}#key-1`)
  console.log('\nWARNING: Never commit VITE_OB_SIGNING_KEY_PRIVATE.')
  console.log('In production, this private key must move to KMS — see src/lib/credentials/keyProvider.ts\n')
}

main().catch((err) => {
  console.error('Key generation failed:', err)
  process.exit(1)
})
