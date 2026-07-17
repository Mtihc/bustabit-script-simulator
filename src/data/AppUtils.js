import { randomBytes, bytesToHex } from '@noble/hashes/utils.js'

function getUniqueID(existingIds) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let id = bytesToHex(randomBytes(16))
    if (!existingIds || existingIds.indexOf(id) === -1) {
      return id
    }
  }
}

function capitalize (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export { getUniqueID, capitalize };
