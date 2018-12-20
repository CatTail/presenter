/* global Firebase */
/* pubsub */
var firebase = new Firebase('https://presenterjs.firebaseio.com/')
// remove hash, conver to base64
var APPNAME = window.btoa(window.location.href.slice(0, window.location.href.indexOf(window.location.hash)))
var i18n = {
  zh: {
    publish: '开启发布者模式'
  },
  en: {
    publish: 'publish mode on'
  }
}

function Presenter (password, language) {
  if (!(this instanceof Presenter)) return new Presenter(password, language)
  this.messages = i18n[language || 'en']

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
  // firebase.child(APPNAME).off('value')
  firebase.child(APPNAME).on('value', function (snapshot) {
    console.log(snapshot.val())
    location.href = snapshot.val()
  })
}

Presenter.prototype.publish = function () {
  alert(this.messages.publish)
  this.toggleQRCode()
  window.onhashchange = this.onHashChange
}

Presenter.prototype.onHashChange = function () {
  var data = {}
  data[APPNAME] = location.href
  firebase.update(data)
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

Presenter.prototype.toggleQRCode = function () {
  if (this.elCode.style.display === 'none') {
    this.elCode.style.display = 'block'
  } else {
    this.elCode.style.display = 'none'
  }
}

Presenter('god')

// TODO
// module.exports = Presenter
