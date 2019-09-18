## Logger
```js
const bifs = require('./index');

const logger = new bifs.Logger({
    project: 'PROJECT_ID',
    service: 'SERVICE_ID',
    auth: {
        key: 'AUTH_KEY',
        secret: 'AUTH_SECRET'
    }
});

logger.capture('EVENT_NAME', 'EVENT_DATA', 'EVENT_CATEGORY')({
    'VARS_1_KEY': 'VARS_1_VALUE',
    'VARS_2_KEY': 'VARS_2_VALUE'
}, 'CHANNEL_ID').then(console.log).catch(console.log);
```