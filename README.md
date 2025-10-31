# Azure Functions Example Backend

A modern Azure Functions backend built with TypeScript using the latest v4 programming model. This example demonstrates best practices for building serverless APIs with Azure Functions.

## 🚀 Features

- **Azure Functions v4** - Latest programming model with improved developer experience
- **TypeScript** - Type-safe code with strict compiler settings
- **ESLint** - Code quality and consistency checks
- **Multiple Function Examples**:
  - HTTP GET trigger (Query parameters)
  - HTTP POST trigger (JSON body handling)
  - RESTful API (GET, POST, PUT, DELETE)
  - Advanced User Management API (with utilities and models)
  - Timer triggers (Scheduled tasks)
  - Queue trigger (Asynchronous message processing)
- **Best Practices**:
  - Organized code structure (models, utils)
  - Type-safe utilities and helpers
  - Error handling patterns
  - API response standardization
- **Modern Node.js** - Built for Node.js 20 LTS

## 📋 Prerequisites

- [Node.js 18+](https://nodejs.org/) (20 LTS recommended)
- [Azure Functions Core Tools v4](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure Account](https://azure.microsoft.com/free/) (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Krugou/azurefunctionsexamplebackend.git
cd azurefunctionsexamplebackend
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## 🏃 Running Locally

1. Start the Azure Functions runtime:
```bash
npm start
```

2. The functions will be available at:
   - `http://localhost:7071/api/hello` - GET request with optional `name` query parameter
   - `http://localhost:7071/api/data` - POST request with JSON body
   - `http://localhost:7071/api/items` - RESTful API (GET all items)
   - `http://localhost:7071/api/items/{id}` - RESTful API (GET/PUT/DELETE specific item)

## 📝 Example API Requests

### GET Request
```bash
curl http://localhost:7071/api/hello?name=Azure
```

Response:
```json
{
  "message": "Hello, Azure!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "method": "GET"
}
```

### POST Request
```bash
curl -X POST http://localhost:7071/api/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "data": {"key": "value"}}'
```

Response:
```json
{
  "message": "Data received successfully",
  "receivedData": {
    "name": "Test",
    "data": {"key": "value"}
  },
  "processedAt": "2024-01-01T12:00:00.000Z"
}
```

### RESTful API - Get All Items
```bash
curl http://localhost:7071/api/items
```

### RESTful API - Get Single Item
```bash
curl http://localhost:7071/api/items/123
```

### RESTful API - Create Item
```bash
curl -X POST http://localhost:7071/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "description": "Item description"}'
```

### RESTful API - Update Item
```bash
curl -X PUT http://localhost:7071/api/items/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "description": "Updated description"}'
```

### RESTful API - Delete Item
```bash
curl -X DELETE http://localhost:7071/api/items/123
```

## 🧹 Development

### Build
```bash
npm run build
```

### Watch Mode (Auto-rebuild on changes)
```bash
npm run watch
```

### Linting
```bash
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

### Prepare for Deployment
```bash
npm run predeploy
```
This runs clean, build, and lint in sequence.

### Clean Build Artifacts
```bash
npm run clean
```

## 🌐 Deployment to Azure

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy Using Azure CLI

1. Login to Azure:
```bash
az login
```

2. Create a resource group:
```bash
az group create --name myResourceGroup --location eastus
```

3. Create a storage account:
```bash
az storage account create \
  --name mystorageaccount \
  --location eastus \
  --resource-group myResourceGroup \
  --sku Standard_LRS
```

4. Create a function app:
```bash
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name myFunctionApp \
  --storage-account mystorageaccount
```

5. Deploy the function:
```bash
npm run build
func azure functionapp publish myFunctionApp
```

### Using VS Code

1. Install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
2. Press `F1` and select `Azure Functions: Deploy to Function App...`
3. Follow the prompts to create or select a function app

## 📁 Project Structure

```
azurefunctionsexamplebackend/
├── src/
│   ├── functions.ts              # Basic HTTP trigger examples
│   ├── advancedFunctions.ts      # Advanced User Management API
│   ├── timerFunctions.ts         # Timer trigger examples
│   ├── queueFunctions.ts         # Queue trigger example
│   ├── models/
│   │   └── types.ts              # TypeScript interfaces and types
│   └── utils/
│       └── helpers.ts            # Utility functions
├── dist/                         # Compiled JavaScript (generated)
├── node_modules/                 # Dependencies
├── .vscode/                      # VS Code configuration
│   ├── extensions.json           # Recommended extensions
│   ├── launch.json               # Debug configuration
│   ├── settings.json             # Editor settings
│   └── tasks.json                # Build tasks
├── .env.example                  # Environment variables template
├── .funcignore                   # Files to exclude from deployment
├── .gitignore                    # Git ignore rules
├── CONTRIBUTING.md               # Contribution guidelines
├── DEPLOYMENT.md                 # Detailed deployment guide
├── eslint.config.js              # ESLint configuration
├── host.json                     # Azure Functions host configuration
├── local.settings.json           # Local development settings (not in git)
├── package.json                  # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🔧 Configuration

### host.json
Contains Azure Functions host configuration including logging and extension bundle settings.

### local.settings.json
Local development settings. Not committed to git. Contains:
- `AzureWebJobsStorage`: Storage connection string
- `FUNCTIONS_WORKER_RUNTIME`: Set to "node"
- `AzureWebJobsFeatureFlags`: Feature flags

### tsconfig.json
TypeScript compiler configuration with strict settings for better type safety.

## 📚 Available Functions

### HTTP Triggers

#### `hello` (GET /api/hello)
Simple GET endpoint that accepts a name query parameter and returns a greeting.

#### `data` (POST /api/data)
POST endpoint that accepts JSON data and returns a confirmation.

#### `items` (GET, POST, PUT, DELETE /api/items)
RESTful API endpoint supporting CRUD operations:
- `GET /api/items` - List all items
- `GET /api/items/{id}` - Get a specific item
- `POST /api/items` - Create a new item
- `PUT /api/items/{id}` - Update an existing item
- `DELETE /api/items/{id}` - Delete an item

#### `users` (GET, POST, PUT, DELETE /api/users)
Advanced User Management API demonstrating best practices:
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get a specific user
- `POST /api/users` - Create a new user (with validation)
- `PUT /api/users/{id}` - Update an existing user
- `DELETE /api/users/{id}` - Delete a user

Features:
- Input validation
- Email format validation
- Standardized API responses
- Error handling
- Uses helper utilities and type definitions
- `PUT /api/items/{id}` - Update an existing item
- `DELETE /api/items/{id}` - Delete an item

### Timer Triggers

#### `scheduledTask`
Runs every 5 minutes. Can be used for periodic tasks like cleanup or monitoring.

#### `dailyTask`
Runs daily at midnight UTC. Useful for daily maintenance tasks or reports.

### Queue Triggers

#### `processQueue`
Processes messages from Azure Storage Queue (`orders-queue`).
- Demonstrates asynchronous message processing
- Includes error handling and retry logic
- Useful for decoupling systems and background processing

#### `enqueue` (POST /api/enqueue)
Helper endpoint to test queue functionality (mock implementation).

## 🛡️ Security

- All HTTP functions use `anonymous` authentication level for easy testing
- For production, consider using:
  - `function` level (requires function key)
  - `admin` level (requires admin key)
  - Azure AD authentication
  - API Management integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

MIT

## 🔗 Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions TypeScript Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node)
- [Azure Functions v4 Programming Model](https://docs.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4)
- [Azure Functions Best Practices](https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
