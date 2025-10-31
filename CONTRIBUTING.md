# Contributing to Azure Functions Example Backend

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/azurefunctionsexamplebackend.git
   cd azurefunctionsexamplebackend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes in the `src/` directory
2. Build the project:
   ```bash
   npm run build
   ```
3. Run linting:
   ```bash
   npm run lint
   ```
4. Fix any linting issues:
   ```bash
   npm run lint:fix
   ```

## Code Style

- This project uses TypeScript with strict mode enabled
- ESLint is configured to enforce code quality
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Follow the existing code structure and patterns

## Project Structure

```
src/
├── functions.ts          # Basic HTTP function examples
├── timerFunctions.ts     # Timer trigger examples
├── advancedFunctions.ts  # Advanced examples with utilities
├── models/              # Type definitions and interfaces
│   └── types.ts
└── utils/               # Utility functions
    └── helpers.ts
```

## Testing Your Changes

Currently, this project doesn't have automated tests. When adding new features:

1. Test manually using Azure Functions Core Tools
2. Verify all HTTP endpoints work as expected
3. Check timer functions are registered correctly
4. Ensure no TypeScript compilation errors
5. Verify ESLint passes

## Submitting Changes

1. Ensure your code builds without errors
2. Ensure ESLint passes
3. Commit your changes with a clear commit message:
   ```bash
   git commit -m "Add feature: description of your change"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request from your fork to the main repository

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure the code builds and lints successfully
- Keep changes focused and atomic
- Update documentation if needed

## Adding New Functions

When adding new Azure Functions:

1. Create a new file in `src/` or add to existing files
2. Import required types from `@azure/functions`
3. Use the `app.http()` or `app.timer()` registration pattern
4. Add proper TypeScript types
5. Include JSDoc comments
6. Update README.md with new endpoints

Example:
```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Description of your function
 */
async function myFunction(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Your code here
}

app.http('myFunctionName', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'my-route',
  handler: myFunction
});
```

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

If you have questions, feel free to:
- Open an issue
- Reach out to the maintainers
- Check the Azure Functions documentation

Thank you for contributing! 🎉
