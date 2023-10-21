const Router = require('hermesjs/lib/router');
const {validateMessage} = require('../../lib/message-validator');
const router = new Router();
const lightMeasuredHandler = require('../handlers/light-measured');
module.exports = router;



/**
 * Inform about environmental lighting conditions for a particular streetlight.
 */
router.use('light/measured', async (message, next) => {
  try {
    
    await validateMessage(message.payload,'light/measured','LightMeasured','publish');
    await lightMeasuredHandler._onLightMeasured({message});
    next();
    
  } catch (e) {
    next(e);
  }
});
