function Presenter (password) {
  var self = this

  // remove hash, conver to base64
  self.appName = window.btoa(window.location.href.slice(0, window.location.href.indexOf(window.location.hash)))
  self.peers = {}
  self.peerId = self.appName + ' ' + Math.random().toString().slice(2)
  self.peer = new Peer(self.peerId, { host: 'peerjs.now.sh', port: 443, secure: true })

  self.fetchPeers()
  self.peer.on('connection', function (conn) {
    self.peers[conn.peer] = conn
  })

  // initialize publish mode
  var pass = password.split('').join(' ')
  cheet(pass, function () {
    self.publish()
    cheet.disable(pass)
  })

  // active subscribe mode
  self.subscribe()

  // qrcode
  self.createQRCode()
  cheet('q', function () {
    self.toggleQRCode()
  })
}

Presenter.prototype.publish = function () {
  window.alert('publish mode on')
  this.toggleQRCode()
  window.onhashchange = this.onHashChange.bind(this)
}

Presenter.prototype.subscribe = function () {
  this.peer.on('connection', function (conn) {
    conn.on('data', function (data) {
      window.location.href = data
    })
  })
}

Presenter.prototype.fetchPeers = function () {
  var self = this
  this.peer.listAllPeers(function (peers) {
    peers
      .filter(function (id) { return id !== self.peerId })
      .forEach(function (id) {
        self.peers[id] = self.peers[id] || self.peer.connect(id)
      })
  })
}

Presenter.prototype.onHashChange = function () {
  var self = this
  Object.keys(self.peers)
    .filter(function (id) { return self.peers[id].open })
    .forEach(function (id) { self.peers[id].send(window.location.href) })
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
