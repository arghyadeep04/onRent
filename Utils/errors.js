class AppErrors extends Error{
    constructor(stat,msg){
        super();
        this.message=msg;
        this.status=stat
    }
}

const basicHandle=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(next)
}}

module.exports={AppErrors,basicHandle}