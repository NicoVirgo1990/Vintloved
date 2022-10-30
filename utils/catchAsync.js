module.exports = fn => {
    return (req, res, next)=>{
         // fn is the async function 
        //next allow that the error go globalErrorHandler
        fn(req, res, next).catch(next);
    }
}