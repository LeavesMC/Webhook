/**
 * Logs an informational message to the console.
 * @param {string} tag - A tag to categorize the log message (e.g., "Server", "HTTP", "Debug").
 * @param {string} message - The message content.
 */
function infolog(tag, message) {
  console.log(`[${tag}]: ${message}`);
}

/**
 * Logs a warning message to the console.
 * @param {string} tag - A tag to categorize the warning message.
 * @param {string} message - The warning message content.
 */
function warnlog(tag, message) {
  console.warn(`[${tag}]: ${message}`);
}

/**
 * Logs an error message to the console.
 * @param {string} tag - A tag to categorize the error message.
 * @param {string} message - The error message content.
 */
function errlog(tag, message) {
  console.error(`[${tag}]: ${message}`);
}

module.exports = {
  infolog,
  warnlog,
  errlog,
};
