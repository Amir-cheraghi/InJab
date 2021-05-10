const paginate = require('mongoose-paginate-v2')
const Category = require("../models/category");
const PostModel = require("../models/post");
const moment = require('moment-jalaali');




const queryFilter = async (reqQuery,publisherId)=>{

    // CATEGORY
    const category = await Category.find();
    // REMOVE FEATURES
    const queryObj = { ...reqQuery }
    const except = ['sort', 'page', 'limit', 'fields']
    except.forEach(el => { delete queryObj[el] });

    // DEFINE QUERY AND PAGE 
    const page = parseInt(reqQuery.page) || 1
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|text|search|lte|lt)\b/g, match => { return `$${match}` })
    

    //EXECUTE QQUERY
    const query = publisherId?{...JSON.parse(queryStr),publisherId:publisherId} : JSON.parse(queryStr)
    const data = await PostModel.paginate(query, {
      page: page,
      offset: (page - 1) * 10,
      limit: 10,
      select: 'title id description createdAt ',
      sort : {createdAt : -1 }
    })

    return {
        data: data.docs,
        date : data.docs.map((item) => { return moment(item.createdAt).locale('fa').format('منتشر شده در jDD jMMMM jYYYY') }),
        maxPage: data.totalPages,
        hasNextPage: data.hasNextPage,
        nextPage: data.nextPage,
        hasPrePage: data.hasPrevPage,
        prePage: data.prevPage,
        activePage: data.page,
        jobs: category.find(el => { return el.name === 'jobs' }).data,
        citys: category.find(el => { return el.name === 'citys' }).data,
        degree: category.find(el => { return el.name === 'degree' }).data,
        gender: category.find(el => { return el.name === 'gender' }).data,
        time: category.find(el => { return el.name === 'time' }).data
    }
}

module.exports = queryFilter