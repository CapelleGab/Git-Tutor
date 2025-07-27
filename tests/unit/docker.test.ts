import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { DockerManager } from '../../src/manager/docker.js'
import { execSync } from 'child_process'

// Mock execSync
vi.mock('child_process', () => ({
  execSync: vi.fn()
}))

const mockExecSync = vi.mocked(execSync)

describe('docker', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>
  let mockExecSync: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    vi.clearAllMocks()
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => { })
    const { execSync } = await import('child_process')
    mockExecSync = vi.mocked(execSync)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a container successfully', async () => {
    mockExecSync.mockImplementation((command: string) => {
      if (command.includes('docker stop') || command.includes('docker rm')) {
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

    expect(mockExecSync).toHaveBeenCalledWith(
      'docker run -dit --name git-tutor-123 -v /workspaces/test:/workspace git-tutor:latest',
      { stdio: 'inherit' }
    )

    expect(mockConsoleLog).toHaveBeenCalledWith('✅ Container git-tutor-123 created and started')
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

  it('should display show access instructions when showAccessInstructions is called', () => {
    const containerName = 'git-tutor-123'
    DockerManager.showAccessInstructions(containerName)

    expect(mockConsoleLog).toHaveBeenCalledWith('\n📋 Instructions:')
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '1. Open a new terminal'
    )
    expect(mockConsoleLog).toHaveBeenCalledWith(
      `2. Access your practice environment:`
    )
    expect(mockConsoleLog).toHaveBeenCalledWith(
      `   docker exec -it ${containerName} bash`
    )
    expect(mockConsoleLog).toHaveBeenCalledWith('3. When you\'re done, exit the container with: exit')
    expect(mockConsoleLog).toHaveBeenCalledWith('4. The container will be automatically cleaned up')
  })

})
