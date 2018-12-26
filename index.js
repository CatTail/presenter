function Presenter () {
  var self = this

  // bind methods with this
  Object.getOwnPropertyNames(Object.getPrototypeOf(self))
    .filter(function (name) { return typeof self[name] === 'function' })
    .filter(function (name) { return name !== 'constructor' })
    .forEach(function (name) { self[name] = self[name].bind(self) })

  // remove hash, conver to base64
  self.appName = window.btoa(window.location.href.slice(0, window.location.href.indexOf(window.location.hash)))
  // remove invalid characters
  self.namespace = self.appName.replace(/[^a-zA-Z0-9]+/g, '')
  self.peerId = self.namespace + ' ' + Math.random().toString().slice(2)
  self.peers = {}
  self.peer = null
  self.touchCount = 0
  self.timeoutId = null

  self.register()
  self.subscribe()

  document.addEventListener('keypress', self.onKeyPress)
  document.addEventListener('mousedown', self.onTouchStart)
  document.addEventListener('touchstart', self.onTouchStart)
}

Presenter.prototype.register = function () {
  var self = this

  self.peer = new Peer(self.peerId, { host: 'peerjs.now.sh', port: 443, secure: true })
  self.peer.on('connection', function (conn) {
    self.peers[conn.peer] = conn
    conn.on('data', self.onDatahandler)
  })
}

Presenter.prototype.publish = function () {
  window.alert('publish mode on')
  window.onhashchange = this.onHashChange
}

Presenter.prototype.subscribe = function () {
  var self = this
  this.peer.listAllPeers(function (peers) {
    peers
    // filter peers in the same namespace
      .filter(function (id) { return id !== self.peerId && id.split(' ')[0] === self.namespace })
      .forEach(function (id) {
        if (!self.peers[id]) {
          var conn = self.peer.connect(id)
          conn.on('data', self.onDatahandler)
          self.peers[id] = conn
        }
      })
  })
}

Presenter.prototype.onTouchStart = function (event) {
  var self = this

  if (self.timeoutId) {
    clearTimeout(self.timeoutId)
    self.timeoutId = null
  }

  self.touchCount = self.touchCount + 1
  if (self.touchCount === 6) {
    document.removeEventListener('mousedown', self.onTouchStart)
    document.removeEventListener('touchstart', self.onTouchStart)
    self.publish()
  } else {
    self.timeoutId = setTimeout(function () {
      self.touchCount = 0
    }, 500)
  }
}

Presenter.prototype.onKeyPress = function (event) {
  if (event.key === 'q') {
    this.toggleQRCode()
  }
}

Presenter.prototype.onHashChange = function () {
  var self = this
  Object.keys(self.peers)
    .filter(function (id) { return self.peers[id].open })
    .forEach(function (id) { self.peers[id].send(window.location.href) })
}

Presenter.prototype.onDatahandler = function (data) {
  window.location.href = data
}

Presenter.prototype.toggleQRCode = function () {
  if (!this.elCode) {
    this.elCode = document.createElement('div')
    this.elCode.style.display = 'none'
    this.elCode.style.position = 'absolute'
    this.elCode.style.top = '0'
    this.elCode.style.right = '0'
    this.elCode.style.zIndex = '1000'
    document.body.appendChild(this.elCode)
    // eslint-disable-next-line
    new QRCode(this.elCode, window.location.href)
  }

  if (this.elCode.style.display === 'none') {
    this.elCode.style.display = 'block'
  } else {
    this.elCode.style.display = 'none'
  }
}

// eslint-disable-next-line
new Presenter()
