import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { menu } from '../../src/menu.js'
import inquirer from 'inquirer'
import { DockerManager } from '../../src/manager/docker.js'
import { setup } from '../../exercises/basic-commands/setup.js'

// Mock dependencies
vi.mock('inquirer')
vi.mock('../../src/manager/docker.js')
vi.mock('../../exercises/basic-commands/setup.js')

const mockInquirer = vi.mocked(inquirer)
const mockDockerManager = vi.mocked(DockerManager)
const mockSetup = vi.mocked(setup)

describe('menu', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>
  let mockProcessExit: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit called')
    }) as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle exit option', async () => {
    mockInquirer.prompt.mockResolvedValueOnce({ exercise: 'exit' })
    mockDockerManager.cleanupAllContainers.mockResolvedValue()

    try {
      await menu()
    } catch (error: any) {
      expect(error.message).toBe('process.exit called')
    }

    expect(mockDockerManager.cleanupAllContainers).toHaveBeenCalled()
    expect(mockProcessExit).toHaveBeenCalledWith(0)
  })

  it('should handle basic-commands exercise', async () => {
    const mockContainerName = 'test-container'

    mockInquirer.prompt
      .mockResolvedValueOnce({ exercise: 'basic-commands' })
      .mockResolvedValueOnce({ ready: '' })

    mockSetup.mockResolvedValue({
      title: 'Test',
      description: 'Test',
      objectives: ['Test'],
      steps: ['Test'],
      containerName: mockContainerName
    })
    mockDockerManager.removeContainer.mockResolvedValue()

    await menu()

    expect(mockSetup).toHaveBeenCalledWith(
      expect.stringContaining('workspaces/basic-commands')
    )
    expect(mockDockerManager.removeContainer).toHaveBeenCalledWith(mockContainerName)
  })
})
