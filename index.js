function Presenter (password) {
  // remove hash, conver to base64
  this.appName = window.btoa(window.location.href.slice(0, window.location.href.indexOf(window.location.hash)))
  this.peerId = this.appName + ' ' + Math.random().toString().slice(2)
  this.peer = new Peer(this.peerId, { host: 'peerjs.now.sh', port: 443, secure: true })
  this.subscribers = {}

  // initialize publish mode
  var pass = password.split('').join(' ')
  cheet(pass, function () {
    this.publish()
    cheet.disable(pass)
  }.bind(this))

  // active subscribe mode
  this.subscribe()

  // qrcode
  this.createQRCode()
  cheet('q', function () {
    this.toggleQRCode()
  }.bind(this))
}

Presenter.prototype.subscribe = function () {
  this.peer.on('connection', function (conn) {
    conn.on('data', function (data) {
      window.location.href = data
    })
  })
}

Presenter.prototype.publish = function () {
  window.alert('publish mode on')
  this.toggleQRCode()
  setInterval(this.refreshSubscribers.bind(this), 1000)
  window.onhashchange = this.onHashChange
}

Presenter.prototype.refreshSubscribers = function () {
  var self = this
  this.peer.listAllPeers(function (peers) {
    peers
      .filter(function (id) { return id !== self.peerId })
      .forEach(function (id) {
        self.subscribers[id] = self.subscribers[id] || self.peer.connect(id)
      })
  })
}

Presenter.prototype.onHashChange = function () {
  var self = this
  Object.keys(self.subscribers)
    .filter(function (id) { return self.subscribers[id].open })
    .forEach(function (id) { self.subscribers[id].send(window.location.href) })
}

Presenter.prototype.createQRCode = function () {
  this.elCode = document.createElement('div')
  this.elCode.style.display = 'none'
  this.elCode.style.position = 'absolute'
  this.elCode.style.top = '0'
  this.elCode.style.right = '0'
  this.elCode.style.zIndex = '1000'
  document.body.appendChild(this.elCode)
  return new QRCode(this.elCode, window.location.href)
}

Presenter.prototype.toggleQRCode = function () {
  if (this.elCode.style.display === 'none') {
    this.elCode.style.display = 'block'
  } else {
    this.elCode.style.display = 'none'
  }
}

// eslint-disable-next-line
new Presenter('god')
