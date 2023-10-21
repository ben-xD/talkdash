
const handler = module.exports = {};


const onLightMeasuredMiddlewares = [];

/**
 * Registers a middleware function for the onLightMeasured operation to be executed during request processing.
 *
 * Middleware functions have access to options object that you can use to access the message content and other helper functions
 *
 * @param {function} middlewareFn - The middleware function to be registered.
 * @throws {TypeError} If middlewareFn is not a function.
 */
handler.registerOnLightMeasuredMiddleware = (middlewareFn) => {
  if (typeof middlewareFn !== 'function') {
    throw new TypeError('middlewareFn must be a function');
  }
  onLightMeasuredMiddlewares.push(middlewareFn);
}

/**
 * Inform about environmental lighting conditions for a particular streetlight.
 *
 * @param {object} options
 * @param {object} options.message
 * @param {integer} options.message.payload.id - Id of the streetlight.
 * @param {integer} options.message.payload.lumens - Light intensity measured in lumens.
 * @param {string} options.message.payload.sentAt - Date and time when the message was sent.
 */
handler._onLightMeasured = async ({message}) => {
  for (const middleware of onLightMeasuredMiddlewares) {
    await middleware(message);
  }
};
