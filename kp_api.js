var KpApi, tmp_api,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

KpApi = (function() {
  function KpApi(app_id, secret) {
    this.app_id = app_id;
    this.secret = secret;
    this.getUserId = bind(this.getUserId, this);
    this.getAccessToken = bind(this.getAccessToken, this);
    this.access_token = '';
    this.user_id = '';
    this.oath_base_url = '//test.klickpush.com:3000/';
    this.easyXDM = easyXDM.noConflict('KpApi');
  }

  KpApi.prototype.getAccessToken = function(callback) {
    this.url = this.oath_base_url + "client/oauth/token";
    return $.ajax({
      type: 'POST',
      url: this.url,
      crossDomain: true,
      data: {
        grant_type: 'client_credentials',
        client_id: this.app_id,
        client_secret: this.secret
      },
      success: (function(_this) {
        return function(responseData, textStatus, jqXHR) {
          _this.access_token = responseData['access_token'];
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function(responseData, textStatus, errorThrown) {
          throw 'getAccessToken failed';
        };
      })(this)
    });
  };

  KpApi.prototype.getUserId = function(callback) {
    console.log('getting userid');
    this.socket = new this.easyXDM.Socket({
      remote: location.protocol + this.oath_base_url + "cookie_view",
      onMessage: (function(_this) {
        return function(message, origin) {
          console.log('adsf');
          _this.user_id = message;
          return callback();
        };
      })(this)
    });
    return this.socket.postMessage("");
  };

  return KpApi;

})();

tmp_api = new KpApi('30286e48104183d66bdae0dcc7614dbac492b07f33fcd0eac177e293531eab2f', '485fe7c80ed2c5246d7864b270ca841801d8a7b621d24c5a2728a8994efd1b0f');

tmp_api.getAccessToken(function() {
  alert(tmp_api.access_token);
  return tmp_api.getUserId(function() {
    return alert(tmp_api.user_id);
  });
});