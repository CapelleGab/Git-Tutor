import { describe, expect, it } from 'vitest'
import { choices } from '../../src/constants/choices.js'
import type { ExerciseChoice } from '../../src/types/exercice.js'

describe('choices', () => {
  it('should contain expected exercise choices', () => {
    expect(choices).toHaveLength(2)

    // Test first choice - Basic commands
    expect(choices[0]).toEqual({
      name: 'Basic commands',
      value: 'basic-commands'
    })

    // Test second choice - Quit
    expect(choices[1]).toEqual({
      name: 'Quit',
      value: 'exit'
    })
  })

  it('should have all choices with required properties', () => {
    choices.forEach((choice: ExerciseChoice) => {
      expect(choice).toHaveProperty('name')
      expect(choice).toHaveProperty('value')
      expect(typeof choice.name).toBe('string')
      expect(typeof choice.value).toBe('string')
      expect(choice.name.length).toBeGreaterThan(0)
      expect(choice.value.length).toBeGreaterThan(0)
    })
  })

  it('should have unique values', () => {
    const values = choices.map(choice => choice.value)
    const uniqueValues = new Set(values)
    expect(uniqueValues.size).toBe(values.length)
  })
})
