function errorHandling  (err, req, res, next) {
if (err || res.status.Code >= 400 ) {
    res.json(
        res.json(
            {
                status: err.status ||
                res.statusCode || 500,
                err: " An error occured. Please try again later."

            }
        )
    )
}
next()
}
export { 
    errorHandling
}
