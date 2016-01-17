var ejs = require('ejs')
var cheet = require('cheet.js')
var QRCode = require('./vendor/qrcode')
var Firebase = require('firebase')

var i18n = {
    zh: {
        publish: '开启发布者模式',
    },
    en: {
        publish: 'publish mode on',
    }
}
// remove hash, conver to base64
var APPNAME = btoa(location.hostname) + btoa(location.port) + btoa(location.pathname)

function Presenter(password, options = {}) {
    if (!(this instanceof Presenter)) return new Presenter(password, options)

    this.messages = i18n[options.language || 'en']

    this._firebase = new Firebase('https://presenterjs.firebaseio.com/')
    this._appRef = this._firebase.child(APPNAME)
    this._messageRef = this._firebase.child('room-messages')
    this._roomRef = this._firebase.child('room-metadata')
    this._privateRoomRef = this._firebase.child('room-private-metadata')
    this._moderatorsRef = this._firebase.child('moderators')
    this._suspensionsRef = this._firebase.child('suspensions')
    this._usersOnlineRef = this._firebase.child('user-names-online')

    // initialize publish mode
    this.createQRCode()
    this.password = password.split('').join(' ')
    cheet(this.password, () => {
        this.toggleQRCode(true)
        cheet.disable(this.password)
    })

    // TODO: fix 300ms delay
    var times = 0
    document.body.addEventListener('touchend', () => {
        times = times + 1
        if (times === password.length) {
            this.publish()
        }
    })

    // active subscribe mode
    // TODO: allow unsubscribe
    this.subscribe()

    if (options.chat) {
        this.getStyle('http://192.168.1.2:5000/dist/presenter.min.css')
        this.getScript('http://192.168.1.2:5000/vendor/jquery-2.1.1.min.js', () => {
            this.getScript('http://192.168.1.2:5000/vendor/firechat-2.0.1.min.js', () => {
                this.chat(options.chat)
            })
        })
    }
}

Presenter.prototype.chat = function () {
    this.chat = new Firechat(this._firebase)

    this._firebase.authAnonymously((error, authData) => {
        if (error) {
            console.log(error)
        }
        this.chat.setUser(authData.uid, 'cattail', user => {
            if (this.data.roomId) {
                this.chat.enterRoom(this.data.roomId)
                this.createChatView()
            } else {
                this.chat.createRoom(APPNAME, 'public', roomId => {
                    this.data.roomId = roomId
                    this._appRef.update(this.data)
                    this.chat.enterRoom(roomId)
                    this.createChatView()
                })
            }
        })
    })
}

Presenter.prototype.createChatView = function () {
    // create firechat-wrapper
    var $container = $('<div id="firechat"></div>')
        .on('keydown keyup keypress', function(event) {
            event.stopPropagation()
        })
    var $messages = $('<div id="firechat__chat"></div>')
    var $input = $('<input type="text" />')

    $container
        .append($messages)
        .append($input)
        .appendTo('body')

    var messages = []
    this.chat.on('message-add', (roomId, message) => {
        messages.push(message)
        renderMessages()
    })
    $input.keyup((event) => {
        if (event.keyCode === 13) {
            this.chat.sendMessage(this.data.roomId, event.target.value)
            event.target.value = ''
        }
    })
    function renderMessages() {
        var html = ejs.render(`
        <% messages.forEach(function(message) { %>
            <div class="message">
                <div class="meta"><%= message.name %></div>
                <div class="content"><%= message.message %></div>
            </div>
        <% }) %>
        `, {messages})
        $messages.html(html)
    }
}

Presenter.prototype.subscribe = function () {
    this._appRef.on('value', snapshot => {
        this.toggleQRCode(false)
        this.data = snapshot.val()
        if (this.data.href) {
            location.href = this.data.href
        }
    })
}

Presenter.prototype.publish = function () {
    alert(this.messages.publish)
    window.onhashchange = this.onHashChange.bind(this)
    // init trigger to hide laptop qrcode
    window.onhashchange()
}

Presenter.prototype.onHashChange = function () {
    this._appRef.update({href: location.href})
}

Presenter.prototype.createQRCode = function () {
    this.elCode = document.createElement('div')
    this.elCode.style.display = 'none'
    this.elCode.style.position = 'absolute'
    this.elCode.style.top = '0'
    this.elCode.style.right = '0'
    this.elCode.style.zIndex = '1000'
    document.body.appendChild(this.elCode)
    new QRCode(this.elCode, location.href)
}

Presenter.prototype.toggleQRCode = function (show) {
    if (show) {
        this.elCode.style.display = 'block'
    } else {
        this.elCode.style.display = 'none'
    }
}

Presenter.prototype.getScript = function (src, func) {
    var script = document.createElement('script')
    script.async = "async"
    script.src = src
    if (func) {
        script.onload = func
    }
    document.getElementsByTagName("head")[0].appendChild( script )
}

Presenter.prototype.getStyle = function (src, func) {
    var style = document.createElement('link')
    style.href = src
    style.rel = "stylesheet"
    if (func) {
        style.onload = func
    }
    document.getElementsByTagName("head")[0].appendChild( style )
}

var createPresenter = module.exports = function createPresenter() {
    return Presenter.apply(null, arguments)
}

createPresenter('god', {chat: true})
