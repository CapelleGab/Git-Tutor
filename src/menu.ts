import inquirer from 'inquirer'
import path from 'node:path'
import { setup } from '../exercises/basic-commands/setup.js'
import { choices } from './constants/choices.js'
import { DockerManager } from './manager/docker.js'

export async function menu() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'exercise',
      message: 'Choose a GitTutor exercise:',
      choices,
    },
  ])

  switch (answer.exercise) {
    case answer.exercise[0]:
      // TODO: Refactor into a functions to handle the exercise
      break
    case 'exit':
      console.log('🧹 Cleaning up any remaining containers...')
      await DockerManager.cleanupAllContainers()
      console.log('See you soon! 👋')
      process.exit(0)
    default:
      break
  }
  // TODO: Refactor into switch case
  if (answer.exercise === 'basic-commands') {
    const containerName = await setup(
      'basic-commands',
      path.join(process.cwd(), 'workspaces/basic-commands')
    )

    console.log(
      '\n👉 Now, perform the required Git actions in the Docker container.'
    )
    console.log('When you are done, press Enter to validate.')

    await inquirer.prompt([
      {
        type: 'input',
        name: 'ready',
        message: 'Ready to validate?',
      },
    ])

    if (containerName) {
      console.log('🧹 Cleaning up Docker container...')
      await DockerManager.removeContainer(containerName)
      console.log('✅ Container cleaned up!')
    }
  }
}
