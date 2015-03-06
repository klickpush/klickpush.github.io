var KpApi, tmp_api,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

KpApi = (function() {
  function KpApi(app_id, secret) {
    this.app_id = app_id;
    this.secret = secret;
    this.getUser = bind(this.getUser, this);
    this.updateUser = bind(this.updateUser, this);
    this.getConvertedTrack = bind(this.getConvertedTrack, this);
    this.getUserId = bind(this.getUserId, this);
    this.getAccessToken = bind(this.getAccessToken, this);
    this.access_token = '';
    this.user_id = '';
    this.oath_base_url = '//test.klickpush.com:3000/';
    this.kpi_base_url = this.oath_base_url + 'api/v1/';
    this.easyXDM = easyXDM.noConflict('KpApi');
    this.converted_track = {};
    this.user = {};
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

  KpApi.prototype.getConvertedTrack = function(callback) {
    console.log('get converted track');
    this.url = this.kpi_base_url + ("users/" + this.user_id + "/tracks/converted.json");
    $.ajaxSetup({
      headers: {
        'Authorization': "Bearer " + this.access_token
      }
    });
    return $.ajax({
      type: 'GET',
      url: this.url,
      crossDomain: true,
      dataType: 'json',
      success: (function(_this) {
        return function(responseData, textStatus, jqXHR) {
          console.log('got converted track');
          _this.converted_track = responseData;
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function(responseData, textStatus, errorThrown) {
          throw 'getConvertedTrack failed';
        };
      })(this)
    });
  };

  KpApi.prototype.updateUser = function(user_data, callback) {
    console.log('updating user');
    this.url = this.kpi_base_url + ("users/" + this.user_id + ".json");
    $.ajaxSetup({
      headers: {
        'Authorization': "Bearer " + this.access_token
      }
    });
    return $.ajax({
      type: 'PUT',
      url: this.url,
      crossDomain: true,
      dataType: 'json',
      data: user_data,
      success: (function(_this) {
        return function(responseData, textStatus, jqXHR) {
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function(responseData, textStatus, errorThrown) {
          throw 'updateUser failed';
        };
      })(this)
    });
  };

  KpApi.prototype.getUser = function(callback) {
    console.log('getting user');
    this.url = this.kpi_base_url + ("users/" + this.user_id + ".json");
    $.ajaxSetup({
      headers: {
        'Authorization': "Bearer " + this.access_token
      }
    });
    return $.ajax({
      type: 'GET',
      url: this.url,
      crossDomain: true,
      dataType: 'json',
      success: (function(_this) {
        return function(responseData, textStatus, jqXHR) {
          _this.user = responseData;
          return callback();
        };
      })(this),
      error: (function(_this) {
        return function(responseData, textStatus, errorThrown) {
          throw 'getUser failed';
        };
      })(this)
    });
  };

  return KpApi;

})();

tmp_api = new KpApi('30286e48104183d66bdae0dcc7614dbac492b07f33fcd0eac177e293531eab2f', '485fe7c80ed2c5246d7864b270ca841801d8a7b621d24c5a2728a8994efd1b0f');

tmp_api.getAccessToken(function() {
  return tmp_api.getUserId(function() {
    return tmp_api.getConvertedTrack(function() {
      return tmp_api.getUser(function() {
        console.log(tmp_api.user);
        alert(tmp_api.user);
        return tmp_api.updateUser({
          user: {
            email: 'ifndef@gmail.com'
          }
        }, function() {
          return tmp_api.getUser(function() {
            return alert(tmp_api.user);
          });
        });
      });
    });
  });
});