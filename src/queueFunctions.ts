import { app, InvocationContext, HttpRequest, HttpResponseInit } from '@azure/functions';

/**
 * Queue Trigger Function - Process messages from a storage queue
 * 
 * This function is triggered when a message is added to the specified Azure Storage Queue.
 * Useful for asynchronous processing, decoupling systems, and handling background tasks.
 * 
 * To test locally:
 * 1. Start Azurite storage emulator
 * 2. Add a message to the queue using Azure Storage Explorer or code
 * 
 * Example message: { "orderId": "12345", "status": "pending" }
 */

interface QueueMessage {
  orderId?: string;
  status?: string;
  data?: unknown;
}

export async function processQueueMessage(
  queueItem: unknown,
  context: InvocationContext
): Promise<void> {
  context.log('Queue trigger function processed message:', queueItem);

  try {
    // Parse the message
    const message = queueItem as QueueMessage;

    // Validate message
    if (!message.orderId) {
      context.error('Invalid message: missing orderId');
      return;
    }

    // Process the message
    context.log(`Processing order: ${message.orderId}`);
    context.log(`Order status: ${message.status || 'unknown'}`);

    // Simulate processing work
    // In a real application, you might:
    // - Update a database
    // - Call external APIs
    // - Send notifications
    // - Generate reports
    // - Process files

    context.log(`Order ${message.orderId} processed successfully`);
  } catch (error) {
    context.error('Error processing queue message:', error);
    // If an error is thrown, the message will be retried
    // After max retries, it will be moved to a poison queue
    throw error;
  }
}

// Register the queue trigger function
// Note: Requires AzureWebJobsStorage connection string in local.settings.json
app.storageQueue('processQueue', {
  queueName: 'orders-queue',
  connection: 'AzureWebJobsStorage',
  handler: processQueueMessage
});

/**
 * HTTP Trigger to add messages to the queue (for testing)
 * POST /api/enqueue
 */
export async function enqueueMessage(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Enqueue message endpoint called');

  try {
    const body = await request.json() as QueueMessage;

    // Note: In a real application, you would use the Azure Storage Queue SDK
    // to add the message to the queue. This is just an example endpoint.
    
    return {
      status: 200,
      jsonBody: {
        success: true,
        message: 'Message would be enqueued',
        data: body,
        note: 'This is a mock response. Implement queue client to actually enqueue messages.'
      }
    };
  } catch (error) {
    context.error('Error parsing request:', error);
    return {
      status: 400,
      jsonBody: {
        success: false,
        error: 'Invalid request body'
      }
    };
  }
}

// Register the enqueue endpoint
app.http('enqueue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'enqueue',
  handler: enqueueMessage
});
