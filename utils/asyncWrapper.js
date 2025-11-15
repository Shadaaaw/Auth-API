const asyncWrapper = (fn) => { //will get a func and catch errors instead of writing the try catch in every func
    return (req,res,next) => {
        fn(req,res,next).catch(next);   //pass the err to the error-handeling middleware
    };
};

module.exports = asyncWrapper;