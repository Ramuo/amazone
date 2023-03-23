const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}



const errorHandler = (err, req, res, next) => {
    // Check the status Code with res (si res.statusCode existe ? utilise res.statusCode : sinon utilise 5000)
    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode 
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode
    console.log('error middleware')
  
    res.status(statusCode)
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}

export {errorHandler, notFound};