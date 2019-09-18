const request = require('superagent');

module.exports = function (config) {
    const t = {};
    const base_url = 'http://logger.bifs.me';

    let project = '';
    let service = '';
    let auth_key = '';
    let auth_secret = '';

    if (config && config.project && typeof config.project === 'string') {
        project = config.project.trim();
    }

    if (!project.length) {
        throw new Error('ERROR:UNDEFINED_PROJECT');
    }

    t.project = project;
    
    if (config && config.service && typeof config.service === 'string') {
        service = config.service.trim();
    }

    if (!service.length) {
        throw new Error('ERROR:UNDEFINED_SERVICE');
    }

    t.service = service;

    if (config && config.auth && config.auth.key && typeof config.auth.key === 'string') {
        auth_key = config.auth.key.trim();
    }

    if (!auth_key.length) {
        throw new Error('ERROR:AUTH_KEY_NOT_SET');
    }

    t.auth_key = auth_key;

    if (config && config.auth && config.auth.secret && typeof config.auth.secret === 'string') {
        auth_secret = config.auth.secret.trim();
    }

    if (!auth_secret.length) {
        throw new Error('ERROR:AUTH_SECRET_NOT_SET');
    }

    t.auth_secret = auth_secret;

    t.capture = function (event_name, event_data = null, event_category = null) {
        const bifs_request = `${t.project}:${t.service}`;
        const authorization = Buffer.from(`${t.auth_key}:${t.auth_secret}`, 'utf-8').toString('base64');
        const postdata = {
            name: event_name
        };

        if (event_data && (typeof event_data === 'string' || typeof event_data === 'number')) {
            if (typeof event_data === 'string') {
                event_data = event_data.trim();

                if (!event_data.length) {
                    event_data = null;
                }
            }

            if (event_data) {
                postdata.data = event_data;
            }
        }

        if (event_category && typeof event_category === 'string') {
            event_category = event_category.trim();

            if (event_category.length) {
                postdata.category = event_category;
            }
        }

        return function (vars = null, channel = null) {
            if (vars && typeof vars === 'object' && !Array.isArray(vars)) {
                postdata.vars = vars;
            }
    
            if (channel && typeof channel === 'string') {
                channel = channel.trim();
    
                if (channel.length) {
                    postdata.channel = channel;
                }
            }    

            return new Promise((resolve, reject) => {
                request
                    .post(`${base_url}/logs`)
                    .set({
                        'bifs-request': bifs_request,
                        'Authorization': `Bearer ${authorization}`
                    })
                    .send(postdata)
                    .end((err, resp) => {
                        if (err) {
                            return reject(err);
                        }
    
                        resolve(resp.body);
                    });
            });    
        }
    }

    return t;
}