exports.badRequest = (message) => {
    const err = new Error(message);
    err.status = 400;
    return err;
}

exports.unauthorizedRequest = (message) => {
    const err = new Error(message);
    err.status = 401;
    return err;
}

exports.notFound = (message) => {
    const err = new Error(message);
    err.status = 404;
    return err;
}

exports.recordExists = (message, response) => {
    const err = new Error(message);
    err.status = 409;
    return err
}

exports.validationError = (message) => {
    const err = new Error(message);
    err.status = 422;
    return err;
}

exports.serverError = (message) => {
    const err = new Error(message);
    err.status = 500;
    return err;
}

exports.tokenError = (message) => {
    const err = new Error(message);
    err.status = 502;
    return err;
}

exports.handleErrorResponse = (res, error) => {
    const status = error.status || 401;
    const message = error.message || 'Internal Server Error';
    res.status(status).json({
        success : false,
        error   : true,
        status  : status,
        data    : message
    })
}

exports.handleSuccessResponse = (res, resData=[]) => {
    res.status(200).json({
        success : true,
        error   : false,
        status  : 200,
        data    : resData
    })
}