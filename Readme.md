# presenter

> Dead simple slide remote control & synchronization

[Live Demo](https://cattail.me/slide/2018/12/10/introduce-to-consul.html#1)

## Installation

Use presenter.min.js from CDN

    <script src="https://cdn.jsdelivr.net/gh/cattail/presenter@1aa45d4/dist/presenter.min.js" type="text/javascript" charset="utf-8"></script>

Or download from https://raw.githubusercontent.com/CatTail/presenter/master/dist/presenter.min.js

## Usage

In the scenery of slide remote control, follow instruction:

1. open slide in laptop which will be controlled, click three times to display an qrcode.  ![qrcode](./assets/qrcode.gif)
2. use your smartphone to scan the qrcode.
3. double tap after a long press to activate `publish mode`. (here we use a laptop to demostrate how to activate publish mode) ![publish mode](./assets/publish-mode.gif)

Now, play your slide in smartphone will be broadcast to all the subscribers.

## How it works

Publisher will broadcast current slide index to all subscribers with [WebRTC](https://webrtc.org/).

## Limit

`presenter` only works with slide **written in html** and use **hash tag** to represent slide index, for example, [remark](https://github.com/gnab/remark).

## License

MIT
