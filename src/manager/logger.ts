import chalk from "chalk"

export class Logger {
  static log(message: string) {
    console.log(message)
  }

  static info(message: string) {
    console.log(chalk.blue(`ℹ️  ${message}`))
  }

  static success(message: string) {
    console.log(chalk.green(`✅ ${message}`))
  }

  static error(message: string) {
    console.error(chalk.red(`❌ ${message}`))
  }

  static warn(message: string) {
    console.warn(chalk.yellow(`⚠️  ${message}`))
  }

  static docker(message: string) {
    console.log(chalk.cyan(`🐳 ${message}`))
  }

  static exercise(message: string) {
    console.log(chalk.magenta(`📚 ${message}`))
  }

  static objective(message: string) {
    console.log(chalk.blue(`🎯 ${message}`))
  }

  static step(message: string) {
    console.log(chalk.gray(`📋 ${message}`))
  }

  static rocket(message: string) {
    console.log(chalk.green(`🚀 ${message}`))
  }

  static cleanup(message: string) {
    console.log(chalk.yellow(`🧹 ${message}`))
  }

  static door(message: string) {
    console.log(chalk.cyan(`🚪 ${message}`))
  }

  static bulb(message: string) {
    console.log(chalk.yellow(`💡 ${message}`))
  }

  static build(message: string) {
    console.log(chalk.cyan(`🔨 ${message}`))
  }

  static download(message: string) {
    console.log(chalk.blue(`📥 ${message}`))
  }

  static welcome() {
    console.log('')
    console.log(chalk.cyan('.------------------------------------------------------------------------.'))
    console.log(chalk.cyan('|                                                                        |'))
    console.log(chalk.cyan('|      ____   ___   _             _____           _                      |'))
    console.log(chalk.cyan('|     / ___| |_ _| | |_          |_   _|  _   _  | |_    ___    _ __     |'))
    console.log(chalk.cyan("|    | |  _   | |  | __|  _____    | |   | | | | | __|  / _ \\  | '__|    |"))
    console.log(chalk.cyan('|    | |_| |  | |  | |_  |_____|   | |   | |_| | | |_  | (_) | | |       |'))
    console.log(chalk.cyan('|     \\____| |___|  \\__|           |_|    \\__,_|  \\__|  \\___/  |_|       |'))
    console.log(chalk.cyan('|                                                                        |'))
    console.log(chalk.cyan("'------------------------------------------------------------------------'"))
    console.log('')
    console.log(chalk.green('🎓 Welcome to GitTutor CLI '))
    console.log(chalk.white('You are about to learn Git in a fun and interactive way'))
    console.log('')
  }

  static brain(message: string) {
    console.log(chalk.magenta(`🧠 ${message}`))
  }

  static goodbye(message: string) {
    console.log(chalk.green(`👋 ${message}`))
  }

  static loading(message: string) {
    console.log(chalk.yellow(`🔄 ${message}`))
  }
}
