#!/usr/bin/env node

import { menu } from './menu.js'
import { checkPrerequisites } from './prerequisites.js'
import { Logger } from './manager/logger.js'

export async function main() {
  Logger.brain('GitTutor - Checking environment...')
  await checkPrerequisites()

  Logger.welcome()

  menu()
}

main()
