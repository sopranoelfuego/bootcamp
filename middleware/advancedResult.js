const advancedResult=(model,populate)=> async(req,res,next)=>{

    let query
    //    copy the request.query
        const cpQuery={...req.query}
        
        // @desc this means that we have to remove the subquery in advanced
        // 
        const removeFields=['select','sort','page','limit']
        
        // @desc loop over  removFields and delete them from cpquery
        removeFields.forEach(match => delete cpQuery[match])
        console.log(cpQuery)
        
        // @desc we have to get back to the string format from json data query 
        let queryString=JSON.stringify(cpQuery)
        // @desc means that we attached a $ sign to the operator
        queryString=queryString.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`)
        /** */
        // @decr then we get back to the json format and use it to query in database
    //  @desc  this is the oroginal query http://localhost/v1/models? which one we distract to get subqueries
      query=model.find(JSON.parse(queryString))
      
      
    
    //   @desc here is the case when the original query has
    // as subquery select like http://localhost/v1/models?select=name,description
      if(req.query.select){
        //   here we get  ["name","description"] in req.query.select which we gonna distructure in fields var
          const fields=req.query.select.split(',').join(' ')
          console.log(fields)
        //   output is name description
          query=query.select(fields)
      }
    
    
    
    //   @descr SORTING
    
      if(req.query.sort){
        //   her is the same like above
          const sortBy=req.query.sort.split(',').join(' ')
          query=query.sort(sortBy)
        }else {
            query=query.sort('-createdAt')
        }
        //   PAGINATION
        const page=parseInt(req.query.page,10) || 1
        const limit=parseInt(req.query.limit,10) || 100
        const startIndex=(page -1)* limit
        const endIndex=page * limit
        const totalDoc=await model.countDocuments()
        query=query.skip(startIndex).limit(limit)

        // when the model has a populate 
        if(populate){
            query=query.populate(populate)
        }
    
         console.log("page:",page,"limit:",limit,"startIndex:",startIndex,"endIndex:",endIndex,"total:",totalDoc)
    
        const result=await query
        // PAGINATION result
        let pagination={}
        if(endIndex < totalDoc){
            pagination.next={
                page:page+1,
                limit
            }
            
        }
         
        if(startIndex>0){
    
            pagination.prev={
                page:page-1,
                limit
            }
        }
     
        res.advancedResults={
            success:true,
            count:result.length,
            pagination,
            data:result

        }
        next()
}


module.exports=advancedResult