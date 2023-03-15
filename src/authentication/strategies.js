const { OAuthStrategy } = require('@feathersjs/authentication-oauth/lib');
const { JWTStrategy } = require('@feathersjs/authentication/lib');
const { NotAuthenticated } = require('@feathersjs/errors');
const { LocalStrategy } = require('@feathersjs/authentication-local/lib');
const querystring = require('querystring');
const logger = require('../logger');
class BaseCustomOAuthStrategy extends OAuthStrategy {
  getRedirect(data, params) {
    let redirectUrl = (params && params.redirectUrl) || null;
    const { redirect } = this.authentication.configuration.oauth;
    redirectUrl = redirectUrl || redirect;
    const separator = redirect.indexOf('?') !== -1 ? '&' : '?';
    const authResult = data;

    const query = authResult.accessToken
      ? {
        access_token: authResult.accessToken,
        refresh_token: authResult.refreshToken,
      }
      : {
        error: data.message || 'Authentication not successful',
      };
    return redirectUrl + separator + querystring.stringify(query);
  }
}

class Auth0Strategy extends BaseCustomOAuthStrategy {
  async getEntityData(profile, existing, params) {
    const baseData = await super.getEntityData(profile, existing, params);

    return {
      ...baseData,
      email: profile.email,
      emailActivated: false,
    };
  }
}

class JWTRefreshableStrategy extends JWTStrategy {
  async authenticate(authentication, params) {
    const { accessToken } = authentication;
    const { entity } = this.configuration;

    if (!accessToken) {
      throw new NotAuthenticated('No access token');
    }

    const payload = await this.authentication.verifyAccessToken(
      accessToken,
      params.jwt
    );

    // If token type is refresh token then throw error
    if (payload.tokenType === 'refresh') {
      logger.info(`User (${payload.sub}) tried to access using refresh token`);
      throw new NotAuthenticated('Invalid access token');
    }

    const result = {
      accessToken,
      authentication: {
        strategy: 'jwt',
        accessToken,
        payload,
      },
    };

    if (entity === null) {
      return result;
    }

    const entityId = await this.getEntityId(result, params);
    const value = await this.getEntity(entityId, params);

    return {
      ...result,
      [entity]: value,
    };
  }
}

class CustomLocalStrategy extends LocalStrategy {
  async getEntityQuery(query, params) {
    const _query = await super.getEntityQuery(query, params);
    _query.emailActivated = true;
    return _query;
  }
}

class GoogleStrategy extends BaseCustomOAuthStrategy {
  getEntityQuery(profile, _params) {
    return { email: profile.email };
  }
  async getEntityData(profile, _, params) {
    // ignore send activation email flow
    params.isLoginSocial = true;

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);
    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      profilePicture: profile.picture,
      email: profile.email,
      emailActivated: true,
      registerType: 'google',
    };
  }
}

module.exports = {
  JWTRefreshableStrategy,
  Auth0Strategy,
  GoogleStrategy,
  CustomLocalStrategy,
};
