class HTTPError extends Error {
    constructor(errorCode, message) {
      super(message);
  
      this.name = this.constructor.name;
      this._errorCode = errorCode; // Use an underscore for the private attribute
      this._message = message;
  
      // Capture the stack trace, excluding the constructor call from it.
      Error.captureStackTrace(this, this.constructor);
    }
  
    get errorCode() {
      return this._errorCode;
    }
  
    get message() {
      return this._message;
    }
  }
module.exports = HTTPError