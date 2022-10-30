const Blog = require('./../model/blogModel');
const factory = require('./handlerFactory');


exports.getAllblogs= factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog, { path: 'models' });
exports.createBlog = factory.createOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
exports.updateBlog= factory.updateOne(Blog);


