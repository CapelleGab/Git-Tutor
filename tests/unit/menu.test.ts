import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { menu } from '../../src/menu.js'
import inquirer from 'inquirer'
import { DockerManager } from '../../src/manager/docker.js'
import { ExerciseManager } from '../../src/manager/exercise.js'
import { Logger } from '../../src/manager/logger.js'

// Mock dependencies
vi.mock('inquirer')
vi.mock('../../src/manager/docker.js')
vi.mock('../../src/manager/exercise.js')
vi.mock('../../src/manager/logger.js')

const mockInquirer = vi.mocked(inquirer)
const mockDockerManager = vi.mocked(DockerManager)
const mockExerciseManager = vi.mocked(ExerciseManager)
const mockLogger = vi.mocked(Logger)

describe('menu', () => {
  let mockProcessExit: any

  beforeEach(() => {
    vi.clearAllMocks()
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

    expect(mockLogger.cleanup).toHaveBeenCalledWith('Cleaning up any remaining containers...')
    expect(mockDockerManager.cleanupAllContainers).toHaveBeenCalled()
    expect(mockLogger.goodbye).toHaveBeenCalledWith('See you soon!')
    expect(mockProcessExit).toHaveBeenCalledWith(0)
  })

  it('should handle basic-commands exercise and return to menu', async () => {
    // Mock two prompts: first basic-commands, then exit to break the loop
    mockInquirer.prompt
      .mockResolvedValueOnce({ exercise: 'basic-commands' })
      .mockResolvedValueOnce({ exercise: 'exit' })

    mockExerciseManager.runExercise.mockResolvedValue()
    mockDockerManager.cleanupAllContainers.mockResolvedValue()

    try {
      await menu()
    } catch (error: any) {
      expect(error.message).toBe('process.exit called')
    }

    expect(mockExerciseManager.runExercise).toHaveBeenCalledWith('basic-commands')
    expect(mockLogger.info).toHaveBeenCalledWith('Returning to main menu...\n')
    expect(mockInquirer.prompt).toHaveBeenCalledTimes(2) // Called twice due to loop
  })

  it('should continue menu loop after exercise completion', async () => {
    // Mock basic-commands followed by exit
    mockInquirer.prompt
      .mockResolvedValueOnce({ exercise: 'basic-commands' })
      .mockResolvedValueOnce({ exercise: 'exit' })

    mockExerciseManager.runExercise.mockResolvedValue()
    mockDockerManager.cleanupAllContainers.mockResolvedValue()

    try {
      await menu()
    } catch (error: any) {
      expect(error.message).toBe('process.exit called')
    }

    // Verify the exercise was run and menu returned
    expect(mockExerciseManager.runExercise).toHaveBeenCalledWith('basic-commands')
    expect(mockLogger.log).toHaveBeenCalledWith('\n' + '='.repeat(50))
    expect(mockLogger.info).toHaveBeenCalledWith('Returning to main menu...\n')

    // Verify exit was handled after returning to menu
    expect(mockLogger.cleanup).toHaveBeenCalledWith('Cleaning up any remaining containers...')
    expect(mockProcessExit).toHaveBeenCalledWith(0)
  })
})
