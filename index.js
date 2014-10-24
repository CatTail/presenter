/* pubsub */
var firebase = new Firebase('https://zhongchiyu.firebaseio.com/');
// remove hash, conver to base64
var appName = btoa(location.href.slice(0, location.href.indexOf(location.hash)));

var hammer = new Hammer(document.body);

/* qrcode */
var qrcodeEl = document.createElement('div');
qrcodeEl.style.display = 'none';
qrcodeEl.style.position = 'absolute';
qrcodeEl.style.top = '0';
qrcodeEl.style.right = '0';
qrcodeEl.style.zIndex = '1000';
document.body.appendChild(qrcodeEl);
new QRCode(qrcodeEl, location.href);

hammer.on('doubletap', function() {
    var lock = false;

    hammer.on('press', toggleQRCode);
    hammer.on('tap', togglePublish);

    setTimeout(function() {
        hammer.off('press', toggleQRCode);
        hammer.off('tap', togglePublish);
        if (!lock) subscribe();
    }, 1000);

    function togglePublish() {
        lock = true;
        hammer.off('tap', togglePublish);
        publish();
    }

    function toggleQRCode() {
        lock = true;
        hammer.off('press', toggleQRCode);
        if (qrcodeEl.style.display === 'none') {
            qrcodeEl.style.display = 'block';
        } else {
            qrcodeEl.style.display = 'none';
        }
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
