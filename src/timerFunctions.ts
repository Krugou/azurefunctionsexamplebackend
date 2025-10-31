import { app, InvocationContext, Timer } from '@azure/functions';

/**
 * Timer Trigger Function - Runs on a schedule
 * This function runs every 5 minutes (can be configured)
 * NCRONTAB format: {second} {minute} {hour} {day} {month} {day-of-week}
 * Example: "0 *&#47;5 * * * *" = every 5 minutes
 */
export async function timerTriggerExample(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log('Timer trigger function executed at:', new Date().toISOString());
  
  if (myTimer.isPastDue) {
    context.warn('Timer trigger is running late!');
  }

  // Example: Perform scheduled tasks
  // - Clean up old data
  // - Send notifications
  // - Generate reports
  // - Sync data from external sources

  context.log('Scheduled task completed successfully');
}

/**
 * Another timer example - Daily task
 * Runs every day at midnight UTC
 * NCRONTAB format: "0 0 0 * * *"
 */
export async function timerTriggerDaily(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log('Daily timer trigger executed at:', new Date().toISOString());
  
  // Example: Daily maintenance tasks
  const stats = {
    executionTime: new Date().toISOString(),
    isPastDue: myTimer.isPastDue,
    scheduleStatus: myTimer.scheduleStatus
  };

  context.log('Daily task stats:', stats);
}

// Register Timer trigger functions
app.timer('scheduledTask', {
  // Runs every 5 minutes
  schedule: '0 */5 * * * *',
  handler: timerTriggerExample
});

app.timer('dailyTask', {
  // Runs every day at midnight UTC
  schedule: '0 0 0 * * *',
  handler: timerTriggerDaily
});
