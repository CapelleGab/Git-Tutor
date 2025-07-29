import fs from 'fs-extra'
import path from 'node:path'
import { DockerManager } from '../../src/manager/docker.js'

export async function setup(exerciseId: string, workspacePath: string) {
  try {
    // Build Docker image if needed
    console.log('🐳 Preparing Docker environment...')
    await DockerManager.buildImageIfNeeded()
    // Create Docker container for this exercise
    const containerName = await DockerManager.createContainer({
      exerciseId,
      workspacePath: path.resolve(workspacePath),
    })

    console.log('✅ Workspace setup complete!')
    DockerManager.showAccessInstructions(containerName)

    return containerName
  } catch (error) {
    console.error(`❌ Error setting up workspace: ${error}`)
    throw error
  }
}
