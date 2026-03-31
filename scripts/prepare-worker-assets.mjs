import { access, rm } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve } from 'node:path'

const redirectPath = resolve(process.cwd(), 'dist', '_redirects')

async function removeIfExists(filePath) {
  try {
    await access(filePath, constants.F_OK)
    await rm(filePath, { force: true })
  } catch {
    // File does not exist; safe to ignore.
  }
}

await removeIfExists(redirectPath)
