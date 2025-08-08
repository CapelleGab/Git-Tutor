import { execSync } from 'child_process'
import { Logger } from './manager/logger.js'

export async function checkPrerequisites() {
  Logger.log('')
  const hasGit = await checkGit()
  const hasDocker = await checkDocker()

  return { hasGit, hasDocker }
}

async function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' })
    Logger.success('Git detected')
    return true
  } catch {
    Logger.error('Git is required !')
    Logger.download('Install Git: https://git-scm.com/downloads')
    process.exit(1)
  }
}

async function checkDocker() {
  try {
    execSync('docker --version', { stdio: 'ignore' })
    Logger.success('Docker detected')
    return true
  } catch {
    Logger.error('Docker is required !')
    Logger.download('Install Docker: https://docker.com/get-started')
    process.exit(1)
  }
}
