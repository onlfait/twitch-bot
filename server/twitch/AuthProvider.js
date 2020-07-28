const { AccessToken } = require("twitch");

const authBaseURL = "https://id.twitch.tv/oauth2/authorize?response_type=token";

function normalizeScopes(scopes) {
  if (typeof scopes === "string") {
    scopes = [scopes];
  } else if (!scopes) {
    scopes = [];
  }
  return scopes;
}

module.exports = class AuthProvider {
  constructor({
    io,
    clientId,
    redirectURI = "http://localhost",
    forceVerify = false,
  } = {}) {
    this.io = io;
    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.forceVerify = forceVerify;

    this.tokenType = "user";
    this.accessToken = null;
    this.currentScopes = [];

    this.__onAuthError = null;
    this.__onAuthSuccess = null;

    io.on("connection", (socket) => {
      socket.on("twitch.auth.error", (message) => {
        this.__onAuthError && this.__onAuthError(message);
      });

      socket.on("twitch.auth.success", (query) => {
        this.__onAuthSuccess && this.__onAuthSuccess(JSON.parse(query));
      });
    });
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  hasScopes(scopes) {
    return scopes.every((scope) => this.currentScopes.includes(scope));
  }

  getAuthUrl(scopes) {
    const redir = encodeURIComponent(this.redirectURI);
    return (
      `${authBaseURL}&client_id=${this.clientId}` +
      `&redirect_uri=${redir}&scope=${scopes.join(" ")}` +
      `&force_verify=${this.forceVerify ? "true" : "false"}`
    );
  }

  getAccessToken(scopes = null) {
    return new Promise((resolve, reject) => {
      scopes = normalizeScopes(scopes);

      if (!this.forceVerify && this.accessToken && this.hasScopes(scopes)) {
        resolve(this.accessToken);
        return;
      }

      const url = this.getAuthUrl(scopes);

      this.io.emit("twitch.auth.redirect", url);

      console.log(`>>> Twitch Auth required at\n\t${url}`);

      this.__onAuthError = (message) => {
        reject(message);
      };

      this.__onAuthSuccess = (query) => {
        scopes.forEach((scope) => this.currentScopes.push(scope));

        this.accessToken = new AccessToken({
          access_token: query.access_token,
          scope: this.currentScopes,
          refresh_token: "",
        });

        resolve(this.accessToken);
      };
    });
  }
};
