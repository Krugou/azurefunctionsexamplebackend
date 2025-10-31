import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * HTTP Trigger Function - Example GET endpoint
 * This function responds to HTTP GET requests
 * URL: http://localhost:7071/api/hello
 */
export async function httpTriggerGet(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('HTTP GET trigger function processed a request.');

  const name = request.query.get('name') || 'World';

  return {
    status: 200,
    jsonBody: {
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
      method: request.method
    }
  };
}

/**
 * HTTP Trigger Function - Example POST endpoint
 * This function responds to HTTP POST requests with JSON body
 * URL: http://localhost:7071/api/data
 */
export async function httpTriggerPost(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('HTTP POST trigger function processed a request.');

  try {
    const body = await request.json() as { name?: string; data?: unknown };
    
    if (!body.name) {
      return {
        status: 400,
        jsonBody: {
          error: 'Please provide a name in the request body'
        }
      };
    }

    return {
      status: 201,
      jsonBody: {
        message: 'Data received successfully',
        receivedData: body,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    context.error('Error parsing request body:', error);
    return {
      status: 400,
      jsonBody: {
        error: 'Invalid JSON in request body'
      }
    };
  }
}

/**
 * HTTP Trigger Function - RESTful API example
 * This function supports multiple HTTP methods
 * URL: http://localhost:7071/api/items/{id?}
 */
export async function httpTriggerRest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`HTTP ${request.method} trigger function processed a request.`);

  const id = request.params.id;
  const method = request.method;

  switch (method) {
    case 'GET':
      if (id) {
        return {
          status: 200,
          jsonBody: {
            id,
            name: `Item ${id}`,
            description: 'This is a sample item',
            createdAt: new Date().toISOString()
          }
        };
      }
      return {
        status: 200,
        jsonBody: {
          items: [
            { id: '1', name: 'Item 1' },
            { id: '2', name: 'Item 2' },
            { id: '3', name: 'Item 3' }
          ],
          total: 3
        }
      };

    case 'POST':
      try {
        const body = await request.json() as { name?: string; description?: string };
        return {
          status: 201,
          jsonBody: {
            id: Math.random().toString(36).substring(7),
            ...body,
            createdAt: new Date().toISOString()
          }
        };
      } catch {
        return {
          status: 400,
          jsonBody: { error: 'Invalid request body' }
        };
      }

    case 'PUT':
      if (!id) {
        return {
          status: 400,
          jsonBody: { error: 'ID is required for PUT requests' }
        };
      }
      try {
        const body = await request.json() as { name?: string; description?: string };
        return {
          status: 200,
          jsonBody: {
            id,
            ...body,
            updatedAt: new Date().toISOString()
          }
        };
      } catch {
        return {
          status: 400,
          jsonBody: { error: 'Invalid request body' }
        };
      }

    case 'DELETE':
      if (!id) {
        return {
          status: 400,
          jsonBody: { error: 'ID is required for DELETE requests' }
        };
      }
      return {
        status: 200,
        jsonBody: {
          message: `Item ${id} deleted successfully`,
          deletedAt: new Date().toISOString()
        }
      };

    default:
      return {
        status: 405,
        jsonBody: { error: 'Method not allowed' }
      };
  }
}

// Register HTTP trigger functions with Azure Functions v4 programming model
app.http('hello', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'hello',
  handler: httpTriggerGet
});

app.http('data', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'data',
  handler: httpTriggerPost
});

app.http('items', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  route: 'items/{id?}',
  handler: httpTriggerRest
});
