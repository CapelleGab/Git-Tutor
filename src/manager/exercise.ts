import path from 'node:path'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import { DockerManager } from './docker.js'
import { Logger } from './logger.js'
import type { ExerciseStep } from '../types/exercice.js'

export interface ExerciseConfig {
  id: string
  title: string
  description: string
  objectives: string[]
  steps: ExerciseStep[]
}

export class ExerciseManager {
  static async runExercise(exerciseId: string): Promise<void> {
    try {
      const workspacePath = path.join(process.cwd(), `workspaces/${exerciseId}`)

      // Setup workspace
      Logger.rocket(`Starting exercise: ${exerciseId}`)
      await this.setupWorkspace(exerciseId, workspacePath)

      // Load exercise metadata
      const config = await this.loadExerciseConfig(exerciseId)

      // Display exercise info
      this.displayExerciseInfo(config)

      // Build Docker image and create container
      Logger.docker('Preparing Docker environment...')
      await DockerManager.buildImageIfNeeded()

      const containerName = await DockerManager.createContainer({
        exerciseId,
        workspacePath: path.resolve(workspacePath)
      })

      Logger.success('Workspace setup complete!')

      // Automatically launch Docker container in current terminal
      Logger.loading('Launching Docker container...')
      this.launchContainer(containerName)

    } catch (error) {
      Logger.error(`Error running exercise: ${error}`)
      throw error
    }
  }

  private static async setupWorkspace(exerciseId: string, workspacePath: string): Promise<void> {
    await fs.ensureDir(workspacePath)

    // Create initial files based on exercise
    if (exerciseId === 'basic-commands') {
      await fs.writeFile(path.join(workspacePath, 'README.md'), 'Hello, world!')
    }
  }

  private static async loadExerciseConfig(exerciseId: string): Promise<ExerciseConfig> {
    const metaPath = path.join(process.cwd(), `exercises/${exerciseId}/meta.json`)
    const meta = await fs.readFile(metaPath, 'utf-8')
    return JSON.parse(meta)
  }

  private static displayExerciseInfo(config: ExerciseConfig): void {
    Logger.exercise(`${config.title}`)
    Logger.log(`📝 ${config.description}\n`)

    Logger.objective('Objectives:')
    config.objectives.forEach((objective, index) => {
      Logger.log(`  ${index + 1}. ${objective}`)
    })

    Logger.step('\nSteps to follow:')
    config.steps.forEach((step, index) => {
      Logger.log(`  ${index + 1}. ${step.title}`)
      Logger.log(`     ${step.description}`)
      Logger.log(`     Commands: ${step.commands.join(', ')}`)
    })
    Logger.log('')
  }

  private static launchContainer(containerName: string): void {
    Logger.door(`Opening Docker container: ${containerName}`)
    Logger.bulb('You are now inside the practice environment!')
    Logger.log('📝 Follow the steps above to complete the exercise.')
    Logger.door('Type "exit" when you\'re done to return to the main menu.\n')

    try {
      // Execute Docker container in the current terminal
      execSync(`docker exec -it ${containerName} bash`, {
        stdio: 'inherit',
        cwd: process.cwd()
      })

      // When user exits the container, cleanup
      Logger.cleanup('Cleaning up container...')
      DockerManager.removeContainer(containerName)
      Logger.success('Exercise completed! Container cleaned up.')

    } catch (error) {
      Logger.error(`Error accessing container: ${error}`)
      // Cleanup on error
      DockerManager.removeContainer(containerName)
    }
  }
}
