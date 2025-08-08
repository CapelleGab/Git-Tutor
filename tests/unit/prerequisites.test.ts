import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { checkPrerequisites } from '../../src/prerequisites.js'
import { Logger } from '../../src/manager/logger.js'

// Mock execSync and Logger
vi.mock('child_process', () => ({
  execSync: vi.fn(),
}))
vi.mock('../../src/manager/logger.js')

const mockLogger = vi.mocked(Logger)

describe('Prerequisites', () => {
  let mockExecSync: ReturnType<typeof vi.fn>
  let mockProcessExit: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const { execSync } = await import('child_process')
    mockExecSync = vi.mocked(execSync)
    mockProcessExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should detect Git installation', async () => {
    mockExecSync.mockReturnValue('')
    const result = await checkPrerequisites()
    expect(result.hasGit).toBe(true)
  })

  it('should detect Docker installation', async () => {
    mockExecSync.mockReturnValue('')
    const result = await checkPrerequisites()
    expect(result.hasDocker).toBe(true)
  })

  it('should handle Git not installed', async () => {
    mockExecSync.mockImplementationOnce(() => {
      throw new Error('git: command not found')
    })

    await expect(checkPrerequisites()).rejects.toThrow('process.exit called')
    expect(mockLogger.error).toHaveBeenCalledWith('Git is required !')
    expect(mockLogger.download).toHaveBeenCalledWith('Install Git: https://git-scm.com/downloads')
    expect(mockProcessExit).toHaveBeenCalledWith(1)
  })

  it('should handle Docker not installed', async () => {
    mockExecSync
      .mockReturnValueOnce('')
      .mockImplementationOnce(() => {
        throw new Error('docker: command not found')
      })

    await expect(checkPrerequisites()).rejects.toThrow('process.exit called')
    expect(mockLogger.success).toHaveBeenCalledWith('Git detected')
    expect(mockLogger.error).toHaveBeenCalledWith('Docker is required !')
    expect(mockLogger.download).toHaveBeenCalledWith('Install Docker: https://docker.com/get-started')
    expect(mockProcessExit).toHaveBeenCalledWith(1)
  })
})
