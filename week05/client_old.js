class Response {

}

class ResponseParser {
  // 负责产生 response class
  // Transfer-Encoding: chunked
  // 状态机
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END= 5;
    this.WAITING_HEADER_BLOCK_END= 6;
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ""
    this.headers = {}
    this.headerName = ""
    this.headerValue = ""

  }
  receive(str) {
    this.current = this.WAITING_STATUS_LINE
    for(let i = 0;i < str.length;i++) {
      this.receiveCharacter(str[i])
    }
  }
  receiveCharacter(char) {
    if(this.current === this.WAITING_STATUS_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine+=char
      }

      if(this.current === this.WAITING_HEADER_NAME) {
        if(char === ':') {
          this.current = this.WAITING_HEADER_SPACE;
        } else if(char === '\r') {
          this.current = this.WAITING_HEADER_BLOCK_END
        } else {
          this.headerName+=char
        }
      }

      if(this.current === this.WAITING_HEADER_BLOCK_END) {
        if(char === '\n') {
          this.current = this.WAITING_BODY
          this.bodyParser = new ChunkedBodyParser()
        }
      }

      if(this.current === this.WAITING_HEADER_VALUE) {
        if(char === '\r') {
          this.current = this.WAITING_HEADER_LINE_END
          this.headers = {
            ...this.headers,
            [this.headerName]: this.headerValue
          }
          this.headerName = ''
          this.headerValue = ''
        } else {
          this.headerValue += char
        }
      }
    }
  }

}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_CHUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }

  get isFinished() {
    return this.bodyParser && this.bod
  }

  receiveChar(char) {
    if(this.current === this.WAITING_LENGTH) {
      if(char === '\r') {
        if(this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *=10
        this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
      }
    }
    if(this.current === this.READING_CHUNK) {
      if(char === '\n') {
        this.current = this.READING_CHUNK
      }
    }
    if(this.current === this.READING_CHUNK) {
      this.content.push(char)
      this.length--
      if(this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    }
    if(this.current === this.WAITING_NEW_LINE) {
      if(char === '\r') {
        this.current = this.WAITING_LENGTH_LINE_END
      }
    }

    if(this.current === this.WAITING_NEW_LINE_END) {
      if(char === '\n') {
        // this.current = this.WAI
      }
    }

  }
}

const parser = new ResponseParser()

const str = `HTTP/1.1 200 OK\r
Date: Sun, 10 Oct 2010 23:26:07 GMT
Server: Apache/2.2.8 (Ubuntu) mod_ssl/2.2.8 OpenSSL/0.9.8g
Last-Modified: Sun, 26 Sep 2010 22:04:35 GMT
ETag: "45b6-834-49130cc1182c0"
Accept-Ranges: bytes
Content-Length: 12
Connection: close
Content-Type: text/html

Hello world!`

parser.receive(str)
