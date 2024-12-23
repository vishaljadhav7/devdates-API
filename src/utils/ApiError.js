
class ApiError  {
    constructor(
        statusCode,
        message,
    ){
        this.statusCode = statusCode
        this.message = message
        this.success = false;

    }
}
module.exports = ApiError
