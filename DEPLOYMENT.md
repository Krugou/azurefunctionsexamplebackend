# Deployment Guide

This guide covers different ways to deploy your Azure Functions backend to Azure.

## Prerequisites

- Azure Account (create one at [azure.com/free](https://azure.com/free))
- Azure CLI installed ([installation guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- Azure Functions Core Tools v4 ([installation guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local))

## Option 1: Deploy Using Azure CLI

### 1. Login to Azure

```bash
az login
```

### 2. Set Your Subscription (if you have multiple)

```bash
az account list --output table
az account set --subscription "Your-Subscription-Name"
```

### 3. Create a Resource Group

```bash
az group create \
  --name rg-functions-example \
  --location eastus
```

### 4. Create a Storage Account

```bash
az storage account create \
  --name stfunctionsexample \
  --location eastus \
  --resource-group rg-functions-example \
  --sku Standard_LRS
```

### 5. Create a Function App

```bash
az functionapp create \
  --resource-group rg-functions-example \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name func-example-backend \
  --storage-account stfunctionsexample \
  --os-type Linux
```

### 6. Build and Deploy

```bash
# Build the TypeScript code
npm run build

# Deploy to Azure
func azure functionapp publish func-example-backend
```

## Option 2: Deploy Using VS Code

### 1. Install VS Code Extension

Install the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

### 2. Sign in to Azure

- Open VS Code
- Click on the Azure icon in the left sidebar
- Click "Sign in to Azure"

### 3. Deploy

- Press `F1` or `Ctrl+Shift+P`
- Type and select: `Azure Functions: Deploy to Function App...`
- Select your subscription
- Choose "Create new Function App in Azure... Advanced"
- Follow the prompts:
  - Enter a globally unique name
  - Select Node.js 20 LTS
  - Select Linux
  - Select a location
  - Create new resource group or select existing
  - Create new storage account or select existing
  - Create new Application Insights or skip

### 4. Wait for Deployment

The extension will build and deploy your function app automatically.

## Option 3: Deploy Using GitHub Actions

### 1. Get Publish Profile

```bash
az functionapp deployment list-publishing-profiles \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --xml
```

### 2. Add Secret to GitHub

- Copy the XML output
- Go to your GitHub repository
- Settings → Secrets and variables → Actions
- New repository secret
- Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
- Paste the XML content

### 3. Create Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure Functions

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AZURE_FUNCTIONAPP_NAME: func-example-backend
  NODE_VERSION: '20.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: '.'
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

### 4. Push and Deploy

Push to main branch to trigger automatic deployment.

## Post-Deployment

### Verify Deployment

```bash
# Get the function app URL
az functionapp show \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --query "defaultHostName" \
  --output tsv
```

### Test Your Functions

```bash
# Test the hello endpoint
curl https://func-example-backend.azurewebsites.net/api/hello?name=Azure

# Test the users endpoint
curl https://func-example-backend.azurewebsites.net/api/users
```

### View Logs

```bash
# Stream logs
func azure functionapp logstream func-example-backend
```

Or view logs in Azure Portal:
- Go to your Function App
- Select "Log stream" from the left menu

## Configuration

### Set Application Settings

```bash
az functionapp config appsettings set \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --settings "CUSTOM_SETTING=value"
```

### Enable Application Insights

```bash
az monitor app-insights component create \
  --app ai-functions-example \
  --location eastus \
  --resource-group rg-functions-example

# Get the instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app ai-functions-example \
  --resource-group rg-functions-example \
  --query instrumentationKey \
  --output tsv)

# Set it in the function app
az functionapp config appsettings set \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY"
```

## Scaling and Performance

### Configure Scale Settings

```bash
az functionapp config set \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --always-on true
```

### Enable Premium Plan (if needed)

```bash
# Create Premium plan
az functionapp plan create \
  --name plan-functions-premium \
  --resource-group rg-functions-example \
  --location eastus \
  --sku EP1 \
  --is-linux

# Update function app to use Premium plan
az functionapp update \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --plan plan-functions-premium
```

## Monitoring

### View Metrics in Portal

1. Go to Azure Portal
2. Navigate to your Function App
3. Select "Metrics" from the left menu
4. Add metrics like:
   - Function Execution Count
   - Function Execution Units
   - Http Server Errors
   - Response Time

### Set Up Alerts

```bash
az monitor metrics alert create \
  --name alert-high-errors \
  --resource-group rg-functions-example \
  --scopes $(az functionapp show --name func-example-backend --resource-group rg-functions-example --query id -o tsv) \
  --condition "count Http5xx > 10" \
  --window-size 5m \
  --evaluation-frequency 1m
```

## Security

### Enable Authentication

```bash
az functionapp auth update \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --enabled true \
  --action LoginWithAzureActiveDirectory
```

### Configure CORS

```bash
az functionapp cors add \
  --name func-example-backend \
  --resource-group rg-functions-example \
  --allowed-origins "https://yourdomain.com"
```

### Use Managed Identity

```bash
az functionapp identity assign \
  --name func-example-backend \
  --resource-group rg-functions-example
```

## Cleanup

To delete all resources:

```bash
az group delete --name rg-functions-example --yes --no-wait
```

## Troubleshooting

### Common Issues

1. **Function not appearing**: Wait a few minutes after deployment
2. **502 errors**: Check if all dependencies are installed
3. **Build fails**: Ensure TypeScript compiles locally first
4. **Timeout errors**: Increase timeout in host.json or move to Premium plan

### Debug Deployment

```bash
# Check deployment status
az functionapp deployment list \
  --name func-example-backend \
  --resource-group rg-functions-example

# View deployment logs
az webapp log deployment show \
  --name func-example-backend \
  --resource-group rg-functions-example
```

## Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/functionapp)
- [Azure Functions Pricing](https://azure.microsoft.com/en-us/pricing/details/functions/)
- [Best Practices](https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
