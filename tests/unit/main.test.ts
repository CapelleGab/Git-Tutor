import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { main } from '../../src/main.js'
import { checkPrerequisites } from '../../src/prerequisites.js'
import { menu } from '../../src/menu.js'
import { Logger } from '../../src/manager/logger.js'

vi.mock('../../src/prerequisites.js', () => ({
  checkPrerequisites: vi.fn(),
}))

vi.mock('../../src/menu.js', () => ({
  menu: vi.fn(),
}))

vi.mock('../../src/manager/logger.js')

const mockLogger = vi.mocked(Logger)

describe('Main function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should execute the complete main flow successfully', async () => {
    const mockCheckPrerequisites = vi.mocked(checkPrerequisites)
    const mockMenu = vi.mocked(menu)
    mockCheckPrerequisites.mockResolvedValue({ hasGit: true, hasDocker: true })
    mockMenu.mockResolvedValue(undefined)
    await main()

    expect(mockCheckPrerequisites).toHaveBeenCalledOnce()
    expect(mockMenu).toHaveBeenCalledOnce()
  })

  it('should call functions in the correct order', async () => {
    const mockCheckPrerequisites = vi.mocked(checkPrerequisites)
    const mockMenu = vi.mocked(menu)
    const callOrder: string[] = []
    mockCheckPrerequisites.mockImplementation(async () => {
      callOrder.push('checkPrerequisites')
      return { hasGit: true, hasDocker: true }
    })
    mockMenu.mockImplementation(async () => {
      callOrder.push('menu')
    })
    await main()

    expect(callOrder).toEqual(['checkPrerequisites', 'menu'])
  })

  it('should handle prerequisites check failure', async () => {
    const mockCheckPrerequisites = vi.mocked(checkPrerequisites)
    const mockMenu = vi.mocked(menu)
    const prerequisitesError = new Error('Prerequisites check failed')
    mockCheckPrerequisites.mockRejectedValue(prerequisitesError)

    await expect(main()).rejects.toThrow('Prerequisites check failed')
    expect(mockMenu).not.toHaveBeenCalled()
  })

  it('should handle menu function failure', async () => {
    const mockCheckPrerequisites = vi.mocked(checkPrerequisites)
    const mockMenu = vi.mocked(menu)
    mockCheckPrerequisites.mockResolvedValue({ hasGit: true, hasDocker: true })
    const menuError = new Error('Menu failed')
    mockMenu.mockRejectedValue(menuError)

    await expect(main()).resolves.toBeUndefined()
    expect(mockCheckPrerequisites).toHaveBeenCalledOnce()
    expect(mockMenu).toHaveBeenCalledOnce()
  })

  it('should display welcome messages', async () => {
    const mockCheckPrerequisites = vi.mocked(checkPrerequisites)
    const mockMenu = vi.mocked(menu)
    mockCheckPrerequisites.mockResolvedValue({ hasGit: true, hasDocker: true })
    mockMenu.mockResolvedValue(undefined)
    await main()

    expect(mockLogger.brain).toHaveBeenCalledWith('GitTutor - Checking environment...')
    expect(mockLogger.welcome).toHaveBeenCalled()
  })
})
