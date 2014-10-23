/* pubsub */
var firebase = new Firebase('https://zhongchiyu.firebaseio.com/');
// remove hash, conver to base64
var appName = btoa(location.href.slice(0, location.href.indexOf(location.hash)));

/* qrcode */
$$(document.body).append('<div id="qrcode" class="hidden"></div>');
var qrcodeEl = document.getElementById('qrcode');
var qrcode = new QRCode(qrcodeEl, location.href);

$$('body').on('doubleTap', function() {
    var lock = false;

    $$('body').on('hold', toggleQRCode);
    $$('body').on('singleTap', togglePublish);

    setTimeout(function() {
        $$('body').off('singleTap', togglePublish);
        $$('body').off('hold', toggleQRCode);
        if (!lock) subscribe();
    }, 1000);

    function togglePublish() {
        lock = true;
        publish();
    }

    function toggleQRCode() {
        lock = true;
        $$(qrcodeEl).toggleClass('hidden');
    }
});

var subscribe = (function() {
    var isSubscriber = false,
        first = true;

    return function subscribeInternal() {
        isSubscriber = !isSubscriber;
        alert('subscribe mode ' + (isSubscriber ? 'on' : 'off'));
        if (isSubscriber) {
            firebase.child(appName).on('value', function(snapshot) {
                console.log(snapshot.val());
                if (!first) {
                    location.href = snapshot.val();
                }
                first = false;
            });
        } else {
            firebase.child(appName).off('value');
        }
    };
})();

var publish = (function() {
    var interval,
        url = location.href,
        isPublisher = false,
        data = {};

    return function publishInternal() {
        isPublisher = !isPublisher;
        alert('publish mode ' + (isPublisher ? 'on' : 'off'));

        if (isPublisher) {
            interval = setInterval(function() {
                if (url !== location.href) {
                    url = location.href;
                    data[appName] = location.href;
                    firebase.update(data);
                }
            }, 100);
        } else {
            clearInterval(interval);
        }
    };
})();
