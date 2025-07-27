# Untested Functions

This document lists all the functions in the codebase that currently lack test coverage. These functions should be prioritized for testing to ensure code reliability and maintainability.

## Functions Without Tests

| Function                 | File                                | Purpose                                                                   |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------- |
| `menu()`                 | `src/menu.ts`                       | Displays interactive menu for exercise selection and handles user choices |
| `setup()`                | `exercises/basic-commands/setup.ts` | Setup of the first exercise                                               |
| `buildImageIfNeeded()`   | `src/manager/docker.ts`             | Build docker image if needed                                              |
| `removeContainer()`      | `src/manager/docker.ts`             | Remove docker container                                                   |
| `isContainerRunning()`   | `src/manager/docker.ts`             | Check if the container is running                                         |
| `execInContainer()`      | `src/manager/docker.ts`             | Execute a any command in container                                        |
| `cleanupAllContainers()` | `src/manager/docker.ts`             | Clear all exercises container                                             |

## Testing Priority

These functions are critical to the application's core functionality:

1. **High Priority**: Docker functions (`buildImageIfNeeded()`, `removeContainer()`, `isContainerRunning()`, `execInContainer()`, `cleanupAllContainers()`) - Core infrastructure for exercise environments
2. **Medium Priority**: `setup()` - Exercise initialization and workspace preparation
3. **Low Priority**: `menu()` - User interface logic (more complex to test due to inquirer prompts)

## Notes

- Functions that call `process.exit()` will require special handling in tests
- Interactive prompts using `inquirer` may need mocking for effective testing
