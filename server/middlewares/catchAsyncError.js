export const CatchAsyncError =  (theFunc) => (req,res,next) =>{
    Promise.resolve(theFunc(req,res,next)).catch(next)
}