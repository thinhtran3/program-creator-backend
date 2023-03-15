const { oauth } = require('@feathersjs/authentication-oauth/lib');
const { CustomAuthenticationService } = require('./service');
const { JWTRefreshableStrategy, GoogleStrategy, CustomLocalStrategy } = require('./strategies');
const { authenticate } = require('@feathersjs/authentication').hooks;
const jose = require('node-jose');
const jwt = require('jsonwebtoken');

const fs = require('fs');
const privateKey = fs.readFileSync('./src/secrets/private.pem', 'utf8');

module.exports = app => {
  const authenticationConfig = app.get('authentication');
  authenticationConfig.secret = privateKey;
  app.set('authentication');

  const authentication = new CustomAuthenticationService(app);

  authentication.register('jwt', new JWTRefreshableStrategy());
  authentication.register('local', new CustomLocalStrategy());
  authentication.register('google', new GoogleStrategy());

  
  app.use('/authentication', authentication);
  app.service('authentication').hooks({
    before: {
      create: [
        ctx => {
          // update redirectUrl to param, because oauth will include it to find user
          if(typeof ctx.params.query !== 'undefined') {
            ctx.params.redirectUrl = ctx.params.query.redirectUrl;
            delete ctx.params.query.redirectUrl;
          }
          
        }
      ]
    }
  });
  // app.use('/logout', {
  //   find: params => {
  //     return authentication.logout(params);
  //   }
  // });
  app.use('/get_token', {
    find: async params => {
      const user = params.user;
      if(user) {
        const _privateKey = await jose.JWK.asKey(privateKey, 'pem');

        const payload = {
          sub: String(user.id),
          iss: 'stella',
          name: user.email,
        };

        const header = {
          alg: 'RS256',
          typ: 'JWT',
        };

        const token = jwt.sign(payload, _privateKey.toPEM(true), {
          algorithm: 'RS256',
          header,
        });

        return {
          token,
          user: {
            id: user.id,
            email: user.email
          }
        };
      }
      return Promise.reject(new Error('User not found!'));
    }
  });
  app.service('get_token').hooks({
    before: {
      find: [
        authenticate('jwt')
      ]
    }
  });
  app.configure(oauth());
};
