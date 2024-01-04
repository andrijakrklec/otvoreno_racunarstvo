class Wrapper {
    constructor(objectJSON, statusCode, message) {
        this._objectJSON = objectJSON;
        this._statusCode = statusCode;

        switch (statusCode) {
            case "200":
                this._statusCodeDescription = "OK";
                break;
            case "201":
                this._statusCodeDescription = "Created";
                break;
            case "204":
                this._statusCodeDescription = "No Content";
                break;
            case "400":
                this._statusCodeDescription = "Bad Request";
                break;
            case "404":
                this._statusCodeDescription = "Not Found";
                break;
            case "422":
                this._statusCodeDescription = "Unprocessable Entity";
                break;
            case "500":
                this._statusCodeDescription = "Internal Server Error";
                break;
            case "501":
            this._statusCodeDescription = "Not Implemented";
            break;
            default:
                this._statusCodeDescription = "";
                break;
        }

        this._message = message;
    }

    get objectJSON() {
        return this._objectJSON;
    }

    set objectJSON(value) {
        this._objectJSON = value;
    }

    get statusCode() {
        return this._statusCode;
    }

    set statusCode(value) {
        this._statusCode = value;
    }

    get statusCodeDescription() {
        return this._statusCodeDescription;
    }

    set statusCodeDescription(value) {
        this._statusCodeDescription = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    response() {
        return {
            "status": this._statusCodeDescription,
            "message": this._message,
            "response": this._objectJSON
        };
    }
}

module.exports = Wrapper;