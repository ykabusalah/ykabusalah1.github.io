module.exports = function(handlebars) {
    var helpers = {
        checklength: function (v1, v2, options) {
            'use strict';
            if (v1.length>v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        truncate:  function (str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                new_str = str.substr (0, len);
                new_str = str.substr (0, new_str.lastIndexOf(" "));
                new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

                return new handlebars.SafeString ( new_str +'...' );
            }
            return str;
        }
    };

    for(helper in helpers) {
        handlebars.registerHelper(helper, helpers[helper]);
    }
};
