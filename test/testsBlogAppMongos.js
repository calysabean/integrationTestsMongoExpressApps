const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { BlogPost } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);


function tearDownDb() {
  return new Promise((resolve, reject) => {
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedBlogPostData() {
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: {
        firstName: ,
        lastName: 
      },
      title: 
      content: 
    });
  }

  return BlogPost.insertMany(seedData);
}


describe('blog posts API', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedBlogPostData();
  });

  afterEach(function () {

    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {

    it('should return all existing posts', function () {
     
      let res;
      return chai.request(app)
        .get('/posts')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          expect(res.body.posts).to.have.lengthOf.at.least(1);
          return BlogPost.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          .then(function(count) {
            expect(res.body.posts).to.have.lengthOf.at.least(1);
        });
    });

    it('should return posts ', function () {

      let resPost;
      return chai.request(app)
        .get('/posts')
        .then(function (res) {

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.posts).to.be.a('array');
            expect(res.body.posts).to.have.lengthOf.at.least(1);
  
          res.body.posts.forEach(function (post) {
            expect(post).to.be.a('object');
            expect(post).to.include.keys('id', 'title', 'content', 'author', 'created');
          });
 
          resPost = res.body[0];
          return BlogPost.findById(resPost.id);
        })
        .then(post => {
            expect(resPost.title).to.equal(posts.title);
            expect(resPost.content).to.equal(posts.content);
            expect(resPost.author).to.equal(posts.author);
              });
    });
  });

  describe('POST endpoint', function () {

    it(' add a new blog post', function () {

      const newPost = {
   
      };

      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function (res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(
            'id', 'title', 'content', 'author');
            expect(res.body.name).to.equal(newPost.name);

            res.body.id.should.not.be.null;
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.author).to.equal(newPost.author);

  
          return BlogPost.findById(res.body.id);
        })
        .then(function (post) {
            expect(post.author).to.equal(newPost.author);
            expect(post.content).to.equal(newPost.content);
            expect(post.title).to.equal(newPost.title);
            
          });
    });
  });

  describe('PUT endpoint', function () {

    it('should update fields you send over', function () {
      const updateData = {
        title: 'title title title',
        content: 'content content content',
        author: {

        }
      };

      return BlogPost
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/posts/${post.id}`)
            .send(updateData);
        })
        .then(res => {
            expect(res).to.have.status(204);
            return BlogPost.findById(updateData.id);
        })
        .then(post => {
            expect(post.title).to.equal(updateData.title);
            expect(post.content).to.equal(updateData.content);
            expect(post.author).to.equal(updateData.author);
     });
    });
  });

  describe('DELETE endpoint', function () {
   
    it('delete a post by id', function () {

      let post;

      return BlogPost
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(res => {

          expect(res).to.have.status(204);
          return BlogPost.findById(post.id);
       
        })
        .then(_post => {
          
            expect(_post).to.be.null;

        });
    });
  });
});