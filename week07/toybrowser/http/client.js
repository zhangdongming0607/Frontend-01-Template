const net = require("net");
const parseHTML = require('./parser')

class Request {
  // method, url = host + port + path
  // body: k/v
  // headers
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.path = options.path || "/";
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(options.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((k) => `${k}=${encodeURIComponent(this.body[k])}`)
        .join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((k) => `${k}: ${this.headers[k]}`)
      .join("\r\n")}\r\n\r\n${this.bodyText}\r\n\r\n`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          { port: this.port, host: this.host },
          () => {
            connection.write(this.toString());
          }
        );
        connection.on("data", (data) => {
          const responseParser = new ResponseParser((response) => {
            // console.log({...response}) // 老师的写法 resolve 调用了三次，其实不太好
            resolve({...response})
            connection.end()
          })
          responseParser.receive(data.toString())
        });
        connection.on("end", (err) => {
          reject(err);
          connection.end();
        });
      }
    });
  }
}

class ResponseParser {
  // 因为 on data 是分包进行的，所以需要使用状态机而不是正则处理
  constructor(onFinished) {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1 // 接受到 \r 触发，等 \n
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_VALUE = 3
    this.WAITING_HEADER_SPACE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6 // 如果 WAITING_HEADER_NAME 遇到了 \r，说明 header 结束了，要等\n，然后就开始 body 了
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.currentHeaderName = ''
    this.currentHeaderValue = ''

    this.bodyParser = null
    this.onFinished = onFinished
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 (\d+) (\s\S)+/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      header: this.headers,
      body: this.bodyParser.content
    }
  }

  receive(str) {
    for(let i = 0;i < str.length;i++) {
      this.receiveCharacter(str[i])
    }
  }

  receiveCharacter(char) {
    // status line
    if(this.current === this.WAITING_STATUS_LINE) {
      if(char === '\r') {
        return this.current = this.WAITING_STATUS_LINE_END
      }
      this.statusLine+=char
    }
    if(this.current === this.WAITING_STATUS_LINE_END) {
      if(char === '\n') {
        return this.current = this.WAITING_HEADER_NAME
      }
    }
    // status line
    if(this.current === this.WAITING_HEADER_NAME) {
      if(char === ':') {
        return this.current = this.WAITING_HEADER_SPACE
      }
      if(char === '\r') {
        return this.current = this.WAITING_HEADER_BLOCK_END
      }
      return this.currentHeaderName+=char
    }
    if(this.current === this.WAITING_HEADER_SPACE) {
      if(char === ' ') {
        return this.current = this.WAITING_HEADER_VALUE
      }
    }
    if(this.current === this.WAITING_HEADER_VALUE) {
      if(char === '\r') {
        this.headers[this.currentHeaderName] = this.currentHeaderValue
        this.currentHeaderName = this.currentHeaderValue = ''
        return this.current = this.WAITING_HEADER_LINE_END
      }
      this.currentHeaderValue+=char
    }

    if(this.current === this.WAITING_HEADER_LINE_END) {
      if(char === '\n') {
        return this.current = this.WAITING_HEADER_NAME
      }
    }
    if(this.current === this.WAITING_HEADER_BLOCK_END) {
      if(char === '\n') {
        this.currentHeaderName = this.currentHeaderValue = '' // 其实这句写不写无所谓
        if(this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser()
        }
        return this.current = this.WAITING_BODY
      }
    }
    if(this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
      if(this.isFinished) {
        this.onFinished(this.response)
      }
    }
  }
}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_BODY_LENGTH = 0
    this.WAITING_BODY_LENGTH_END = 1
    this.WAITING_BODY_CONTENT = 2
    this.WAITING_BODY_CONTENT_END = 3 // 在 Length = 0 时转移状态，下一个是 \r
    this.WAITING_BODY_CONTENT_END_END = 4 // 吃 WAITING_BODY_CONTENT_END 之后的 \n

    this.content = [] // 为什么这里要用数组装？
    this.length = 0
    this.isFinishedChunk = false
    this.isFinished = false
    this.current = this.WAITING_BODY_LENGTH
  }
  receiveChar(char) {
    if(this.current === this.WAITING_BODY_LENGTH) {
      if(char === '\r') {
        if(this.length === 0) {
          this.isFinishedChunk = true
        }
        return this.current = this.WAITING_BODY_LENGTH_END
      }

      return this.length = this.length*16 + Number(char)
    }

    if(this.current === this.WAITING_BODY_LENGTH_END) {
      if(char === '\n') {
        if(this.isFinishedChunk) {
          // 如果长度为 0，直接跳过 WAITING_BODY_CONTENT
          return this.current = this.WAITING_BODY_CONTENT_END
        }
        return this.current = this.WAITING_BODY_CONTENT
      }
    }

    if(this.current === this.WAITING_BODY_CONTENT) {
      this.content.push(char)
      this.length--
      if(this.length === 0) {
        return this.current = this.WAITING_BODY_CONTENT_END
      }
      return
    }
    if(this.current === this.WAITING_BODY_CONTENT_END) {
      if(char === '\r') {
        return this.current = this.WAITING_BODY_CONTENT_END_END
      }
    }
    if(this.current === this.WAITING_BODY_CONTENT_END_END) {
      if(char === '\n') {
        if(this.isFinishedChunk) this.isFinished = true
        return this.current = this.WAITING_BODY_LENGTH
      }
    }
  }
}

class Response {}

(async function () {
  const request = new Request({
    host: "127.0.0.1",
    port: 8089,
    path: "/",
    body: {
      name: "winter",
    },
  });

  let response = await request.send();
  // 如果用 body 是数组，传出来的是引用，尽管 resolve 的时候是 ['o', 'k']，
  // 但是因为后来 this.body 变成了 ['o', 'k', '\r', '\n']（状态机在 isFinished = true 之后还在跑，\r\n 被错误地当做是 body 了）
  // 导致 console 的是最新的数据
  // fix: 1. 让状态机读完 2. 传值类型 3. body 拷贝
  console.log(response)
  // let html = parseHTML(response)
})();
