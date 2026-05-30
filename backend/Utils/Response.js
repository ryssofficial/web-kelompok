export const sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300, 
        message,
        data
    });
};

export const sendError = (res, statusCode, message, error = null) => 
{
    res.status(statusCode).json
    (
        {
        success: false,
        message: message,
        error: error ? error.message : null
        }
    );
};

export const sendNotFound = (res, message = "Data Tidak Ditemukan") =>
{
    res.status(404).json
    (
        {
            success: false, 
            message: message, 
            data: null
        }
    );
};