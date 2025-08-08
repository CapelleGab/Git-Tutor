import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { DockerManager } from '../../src/manager/docker.js'
import { execSync } from 'child_process'
import { Logger } from '../../src/manager/logger.js'

// Mock execSync and Logger
vi.mock('child_process', () => ({
  execSync: vi.fn()
}))
vi.mock('../../src/manager/logger.js')

const mockExecSync = vi.mocked(execSync)
const mockLogger = vi.mocked(Logger)

describe('docker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a container successfully', async () => {
    // Mock execSync calls for removeContainer (stop and rm commands) and docker run
    mockExecSync.mockImplementation((command: string) => {
      if (command.includes('docker stop') || command.includes('docker rm')) {
        // These might fail if container doesn't exist, which is fine
        return ''
      }
      if (command.includes('docker run')) {
        return ''
      }
      return ''
    })

    const containerName = await DockerManager.createContainer({
      exerciseId: '123',
      workspacePath: '/workspaces/test',
    })

    expect(containerName).toBe('git-tutor-123')

    // Verify that docker run command was called with correct parameters
    expect(mockExecSync).toHaveBeenCalledWith(
      'docker run -dit --name git-tutor-123 -v /workspaces/test:/workspace git-tutor:latest',
      { stdio: 'inherit' }
    )

    // Verify success message was logged
    expect(mockLogger.success).toHaveBeenCalledWith('Container git-tutor-123 created and started')
  })

  it('should throw error when docker run fails', async () => {
    // Mock execSync to throw error for docker run command
    mockExecSync.mockImplementation((command: string) => {
      if (command.includes('docker run')) {
        throw new Error('Docker run failed')
      }
      return ''
    })

    await expect(DockerManager.createContainer({
      exerciseId: '123',
      workspacePath: '/workspaces/test',
    })).rejects.toThrow('Failed to create container: Error: Docker run failed')
  })
})
