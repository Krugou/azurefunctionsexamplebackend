# Quick Start Guide

Get your Azure Functions backend running in minutes!

## 🚀 Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/Krugou/azurefunctionsexamplebackend.git
cd azurefunctionsexamplebackend
npm install

# 2. Build
npm run build

# 3. Start (requires Azure Functions Core Tools)
npm start
```

## 📋 Available Endpoints

Once running, your functions will be available at:

### Basic Examples
- **GET** `http://localhost:7071/api/hello?name=YourName`
- **POST** `http://localhost:7071/api/data` (with JSON body)

### RESTful Items API
- **GET** `http://localhost:7071/api/items` - List all
- **GET** `http://localhost:7071/api/items/123` - Get by ID
- **POST** `http://localhost:7071/api/items` - Create new
- **PUT** `http://localhost:7071/api/items/123` - Update
- **DELETE** `http://localhost:7071/api/items/123` - Delete

### User Management API
- **GET** `http://localhost:7071/api/users` - List all users
- **GET** `http://localhost:7071/api/users/user_abc123` - Get user
- **POST** `http://localhost:7071/api/users` - Create user
- **PUT** `http://localhost:7071/api/users/user_abc123` - Update user
- **DELETE** `http://localhost:7071/api/users/user_abc123` - Delete user

### Queue Processing
- **POST** `http://localhost:7071/api/enqueue` - Enqueue message (mock)

## 🧪 Test Commands

### Test GET Request
```bash
curl http://localhost:7071/api/hello?name=Azure
```

### Test POST Request
```bash
curl -X POST http://localhost:7071/api/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "data": {"value": 123}}'
```

### Create a User
```bash
curl -X POST http://localhost:7071/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### List All Users
```bash
curl http://localhost:7071/api/users
```

### Get Specific User
```bash
# Replace USER_ID with actual ID from create response
curl http://localhost:7071/api/users/USER_ID
```

### Update User
```bash
curl -X PUT http://localhost:7071/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

### Delete User
```bash
curl -X DELETE http://localhost:7071/api/users/USER_ID
```

## 🛠️ Development Commands

```bash
# Build TypeScript
npm run build

# Watch mode (auto-rebuild)
npm run watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build artifacts
npm run clean

# Prepare for deployment (clean + build + lint)
npm run predeploy
```

## 📦 What's Included

- ✅ **4 TypeScript function files** with 10+ example functions
- ✅ **HTTP Triggers** - GET, POST, PUT, DELETE examples
- ✅ **Timer Triggers** - Scheduled task examples
- ✅ **Queue Triggers** - Async processing examples
- ✅ **Utilities & Models** - Reusable code and type definitions
- ✅ **ESLint** - Code quality enforcement
- ✅ **VS Code Config** - Debug and task configurations
- ✅ **Comprehensive Docs** - README, DEPLOYMENT, CONTRIBUTING

## 🎯 Next Steps

1. **Explore the code** - Check `src/` directory for examples
2. **Read the docs** - See [README.md](README.md) for detailed info
3. **Deploy to Azure** - Follow [DEPLOYMENT.md](DEPLOYMENT.md) guide
4. **Customize** - Modify functions for your use case
5. **Contribute** - Read [CONTRIBUTING.md](CONTRIBUTING.md) to help improve

## 💡 Tips

- All functions use TypeScript for type safety
- ESLint enforces code quality standards
- Source maps are generated for debugging
- Functions are organized by type (http, timer, queue)
- Utilities are in `src/utils/` for reuse
- Models/types are in `src/models/` for consistency

## 🆘 Troubleshooting

### Functions not starting?
- Ensure Azure Functions Core Tools v4 is installed
- Check `local.settings.json` exists (should be created automatically)
- Verify Node.js version is 18+ (20 LTS recommended)

### TypeScript errors?
- Run `npm run build` to see compilation errors
- Check `tsconfig.json` for configuration
- Ensure all dependencies are installed

### Linting errors?
- Run `npm run lint:fix` to auto-fix issues
- See `eslint.config.js` for rules

## 📚 Resources

- [Azure Functions Docs](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Happy coding!** 🎉
