document.addEventListener('alpine:init', () => {
  Alpine.store('response', {
    myID: '',
    responses: []
  })
  Alpine.data('appData', () => ({
    text: '',
    sendMessage: function() {
      if(this.text == '') 
        return alert('内容不能为空')
      const msg = JSON.stringify({
        id: Alpine.store('response').myID,
        date: (new Date()).getTime(),
        msg: this.text
      })
      window.socket.send(msg)
      this.text = ''
    }
  }))
})

window.onload = () => {

  socket = new WebSocket("ws://127.0.0.1:8080/");

  socket.onopen = () => {
    console.log("Socket 服务启动")
  }
  socket.onclose = () => {
    console.log("Socket 服务关闭");
  }
  socket.onerror = () => {
    console.log("Socket 服务错误");
  }

  socket.onmessage = ({ data }) => {
    const myData = JSON.parse(data)
    if(myData.new) {
      let myID = '';
      if((myID = localStorage.getItem('myID'))) {
        console.log(`*******从客户端得到id：${myID}*******`)
        Alpine.store('response').myID = myID
      } else {
        console.log(`*******从服务端得到id：${myData.new}*******`)
        Alpine.store('response').myID = myData.new
        localStorage.setItem('myID', myData.new)
      }
      Alpine.store('response').responses = myData.data
    }
    if(myData.id) {
      console.log(`*******得到新消息：${myData.id}--${myData.msg}*******`)
      Alpine.store('response').responses.push(myData)
    }
  }

  window.socket = socket

}