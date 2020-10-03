function transfer() {
    var tablink;
    chrome.tabs.getSelected(null, function(tab) {
        tablink = tab.url;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //$("#p1").text("The URL being tested is - "+tablink);
                var server = JSON.parse(this.responseText)
                $("#div1").text(server.decision);
            }
        };
        xhttp.open("GET", "http://127.0.0.1:5000/ltest/" + tablink, true);
        xhttp.send();
        // Uncomment this line if you see some error on the extension to see the full error message for debugging.


        return xhttp.responseText;
    });
}

function fetchFromObject(obj, prop) {

    if (typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if (_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) { t = t + String.fromCharCode(r) }
            if (a != 64) { t = t + String.fromCharCode(i) }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

function loadcategory(url) {
    //var server = "https://mitphish.herokuapp.com/check/";
    var server = "http://127.0.0.1:5000/check/";
    server = server + url;

    var xhttp = new XMLHttpRequest();
    /*  xhttp.onreadystatechange = function() {
         var category = "Unknown";
         if (this.readyState == 4 && this.status == 200) {
             console.log(this.responseText);
             category = this.responseText;
         }

     }; */
    xhttp.open("GET", server, false);
    xhttp.send();
    if (xhttp.status != 200) {
        console.log(xhttp.status);
        return "Unknown";
    } else {
        console.log(xhttp.responseText);
        return xhttp.responseText;
    }

}

function getCategory(url) {
    var hostname = (new URL(url)).hostname; //domain
    var category = checkCache(hostname);

    if (category) {
        console.log("Category was Cached");
        console.log(category);
        return category;
    } else {
        console.log("Category needs to be pulled from server");
        category = loadcategory(url);
        saveCache(hostname, category);
        console.log("Category Cached");
        console.log(category);
        return category;
    }

}

function saveCache(key, value) {

    chrome.storage.local.set({
        [key]: [value]
    }, function(items) {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
}

function checkCache(key) {

    chrome.storage.local.get(key, function(items) {
        if (!chrome.runtime.error) {
            if (items.key == null) {
                return null;
            } else {
                console.log(items.key);
                return items.key;

            }
        }
    });
}

function clearCache() {
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else {
            console.log("cache cleared");
        }
    });
}

function injectSession(session) {
    console.log("injecting session from cache");
    session[0].p1 != null ? document.getElementById('p1').innerText = session[0].p1 : null;
    session[0].p2 != null ? document.getElementById('p2').innerText = session[0].p2 : null;
    session[0].p3 != null ? document.getElementById('p3').innerText = session[0].p3 : null;
    session[0].p4 != null ? document.getElementById('p4').innerText = session[0].p4 : null;

}

function createSession(sessionName, url) {
    var descId = "p1";
    var desc = "Website looks Good!";
    var categoryId = "p3";
    var category = getCategory(url);

    chrome.storage.local.set({
        [sessionName]: [{
            [descId]: desc,
            [categoryId]: category
        }]
    }, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
        console.log("session created. - " + sessionName);
    });

    /*     chrome.storage.local.set({
            [sessionName]: [{ "p1": "Website looks Good!", "p3": "Personal Site" }]
        }, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
            console.log("session created. - " + sessionName);
        }); */


}

function checkSession(url) {
    var sessionName = "session_" + Base64.encode(url);
    chrome.storage.local.get(sessionName, function(session_) {
        if (!chrome.runtime.error) {
            if (session_[sessionName] == null) {
                console.log("create session");
                createSession(sessionName, url);
            } else {
                console.log("Session found");
                injectSession(session_[sessionName]);

            }
        }
    });

}



window.onload = function() { // same as window.addEventListener('load', (event) => {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT }, function(tabs) {
        url = tabs[0].url;
        //clearCache();
        var re = new RegExp("^(http|https)://", "i");
        var match = re.test(url);
        match ? checkSession(url) : clearCache();


    });
};

// // Create Base64 Object


// // Define the string
// var string = "session_https://sunnynir.ml/";

// // Encode the String
// var encodedString = Base64.encode(string);
// console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// // Decode the String
/* var decodedString = Base64.decode("aHR0cHM6Ly9zdW5ueW5pci5tbC8");
console.log(decodedString); // Outputs: "Hello World!" */