export default function Rest (
  client_id = process.env.CLIENT_ID,
  client_secret = process.env.CLIENT_SECRET,
  authUrl = process.env.AUTH_URL
) {
    this._authenticate = function (client_id, client_secret, authUrl) {
      const config = {
        url: authUrl + "/v2/token",
        contentType: "application/json",
        payload: {
          client_id: client_id,
          client_secret: client_secret,
          grant_type: "client_credentials",
        },
      };

      const req = HTTP.Post(
        config.url,
        config.contentType,
        Stringify(config.payload)
      );

      if (req.StatusCode == 200) {
        var res = Platform.Function.ParseJSON(req.Response[0]);
        this.access_token = res.access_token;
        this.token_type = res.token_type;
        this.expires_in = res.expires_in;
        this.scope = res.scope;
        this.soap_instance_url = res.soap_instance_url;
        this.rest_instance_url = res.rest_instance_url;
      } else {
        throw `could not authenticate
            statusCode: ${req.StatusCode}`;
      }
    };
    this.get = function (
      endpoint,
      headers = [],
      continueOnError = true,
      retries = 0,
      emptyContentHandling = 0
    ) {
      return this._fetch(
        endpoint,
        "GET",
        headers,
        undefined,
        continueOnError,
        retries,
        emptyContentHandling
      );
    };
    this.post = function (
      endpoint,
      data,
      headers = [],
      continueOnError = true,
      retries = 0,
      emptyContentHandling = 0
    ) {
      return this._fetch(
        endpoint,
        "POST",
        headers,
        data,
        continueOnError,
        retries,
        emptyContentHandling
      );
    };
    this.put = function (
      endpoint,
      data,
      headers = [],
      continueOnError = true,
      retries = 0,
      emptyContentHandling = 0
    ) {
      return this._fetch(
        endpoint,
        "PUT",
        headers,
        data,
        continueOnError,
        retries,
        emptyContentHandling
      );
    };
    this.patch = function (
      endpoint,
      data,
      headers = [],
      continueOnError = true,
      retries = 0,
      emptyContentHandling = 0
    ) {
      return this._fetch(
        endpoint,
        "PATCH",
        headers,
        data,
        continueOnError,
        retries,
        emptyContentHandling
      );
    };
    this.delete = function (
      endpoint,
      headers = [],
      continueOnError = true,
      retries = 0,
      emptyContentHandling = 0
    ) {
      return this._fetch(
        endpoint,
        "DELETE",
        headers,
        undefined,
        continueOnError,
        retries,
        emptyContentHandling
      );
    };
    this._fetch = function (
      endpoint,
      method,
      headers,
      data,
      continueOnError,
      retries,
      emptyContentHandling
    ) {
      var req = new Script.Util.HttpRequest(
        `${this.rest_instance_url}${endpoint}`
      );
      req.emptyContentHandling = emptyContentHandling;
      req.retries = retries;
      req.continueOnError = continueOnError;
      for (let i = 0; i < headers.length; i++) {
        req.setHeader(headers[i].name, headers[i].value);
      }
      req.setHeader("Authorization", `Bearer ${this.access_token}`);
      req.method = method;
      if (data) {
        data = typeof data === "string" ? data : Stringify(data);
        req.postData = data;
      }
      const resp = req.send();
      return {
        statusCode: resp.statusCode,
        headers: resp.headers,
        data: resp.content,
        json: (() => {
          try{
            return Platform.Function.ParseJSON(String(resp.content));
          } catch(err) {
            return null;
          }
        })()
      };
    }

  this._authenticate(client_id, client_secret, authUrl);
  return this;
};
