#!/usr/bin/env node

import { menu } from './menu.js'
import { checkPrerequisites } from './prerequisites.js'

export async function main() {
  console.log('🧠 GitTutor - Checking environment...')
  await checkPrerequisites()

  console.log('')
  console.log('.------------------------------------------------------------------------.')
  console.log('|                                                                        |')
  console.log('|      ____   ___   _             _____           _                      |')
  console.log('|     / ___| |_ _| | |_          |_   _|  _   _  | |_    ___    _ __     |')
  console.log("|    | |  _   | |  | __|  _____    | |   | | | | | __|  / _ \\  | '__|    |")
  console.log('|    | |_| |  | |  | |_  |_____|   | |   | |_| | | |_  | (_) | | |       |')
  console.log('|     \\____| |___|  \\__|           |_|    \\__,_|  \\__|  \\___/  |_|       |')
  console.log('|                                                                        |')
  console.log("'------------------------------------------------------------------------'")
  console.log('')
  console.log('🎓 Welcome to GitTutor CLI ')
  console.log('You are about to learn Git in a fun and interactive way')
  console.log('')
  
  await menu()
}

main()
