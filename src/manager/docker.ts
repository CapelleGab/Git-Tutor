import { execSync } from 'child_process'
import { Logger } from './logger.js'

const DOCKER_IMAGE = 'git-tutor:latest'

export interface DockerContainerConfig {
  exerciseId: string
  workspacePath: string
}

export class DockerManager {
  static async buildImageIfNeeded(): Promise<void> {
    try {
      execSync(`docker image inspect ${DOCKER_IMAGE}`, { stdio: 'ignore' })
      Logger.success(`Docker image ${DOCKER_IMAGE} found`)
    } catch {
      Logger.build(`Building Docker image ${DOCKER_IMAGE}...`)
      try {
        execSync(`docker build -t ${DOCKER_IMAGE} .`, {
          stdio: 'inherit',
          cwd: process.cwd(),
        })
        Logger.success('Docker image built successfully')
      } catch (error) {
        throw new Error(`Failed to build Docker image: ${error}`)
      }
    }
  }

  static async createContainer(config: DockerContainerConfig): Promise<string> {
    const containerName = `git-tutor-${config.exerciseId}`

    // Clean up existing container if it exists
    await this.removeContainer(containerName)

    const dockerCommand = [
      'docker',
      'run',
      '-dit',
      '--name',
      containerName,
      '-v',
      `${config.workspacePath}:/workspace`,
      DOCKER_IMAGE,
    ]

    try {
      execSync(dockerCommand.join(' '), { stdio: 'inherit' })
      Logger.success(`Container ${containerName} created and started`)
      return containerName
    } catch (error) {
      throw new Error(`Failed to create container: ${error}`)
    }
  }

  static async removeContainer(containerName: string): Promise<void> {
    try {
      execSync(`docker stop ${containerName}`, { stdio: 'ignore' })
    } catch {}

    try {
      execSync(`docker rm ${containerName}`, { stdio: 'ignore' })
    } catch {}
  }

  static isContainerRunning(containerName: string): boolean {
    try {
      const result = execSync(`docker ps -q -f name=${containerName}`, {
        encoding: 'utf8',
      })
      return result.trim().length > 0
    } catch {
      return false
    }
  }

  static async execInContainer(
    containerName: string,
    command: string
  ): Promise<string> {
    try {
      const result = execSync(`docker exec ${containerName} ${command}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })
      return result.trim()
    } catch (error) {
      throw new Error(`Failed to execute command in container: ${error}`)
    }
  }

  static async cleanupAllContainers(): Promise<void> {
    try {
      const containers = execSync('docker ps -a -q -f name=git-tutor-', {
        encoding: 'utf8',
      }).trim()

      if (containers) {
        execSync(`docker rm -f ${containers.split('\n').join(' ')}`, {
          stdio: 'ignore',
        })
        Logger.cleanup('Cleaned up all git-tutor containers')
      }
    } catch {}
  }
}
