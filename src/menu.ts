import inquirer from 'inquirer'
import { choices } from './constants/choices.js'
import { DockerManager } from './manager/docker.js'
import { ExerciseManager } from './manager/exercise.js'
import { Logger } from './manager/logger.js'

export async function menu() {
  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'exercise',
        message: 'Choose a GitTutor exercise:',
        choices,
      },
    ])

    switch (answer.exercise) {
      case 'basic-commands':
        await ExerciseManager.runExercise('basic-commands')
        // After exercise completion, continue the loop to show menu again
        Logger.log('\n' + '='.repeat(50))
        Logger.info('Returning to main menu...\n')
        break
      case 'exit':
        Logger.cleanup('Cleaning up any remaining containers...')
        await DockerManager.cleanupAllContainers()
        Logger.goodbye('See you soon!')
        process.exit(0)
      default:
        break
    }
  }
}
