var request = require('superagent'),
  expect = require('expect.js');

describe('Moment Controller', function(){
  var users = [{"id": 0, "token": ""},
               {"id": 0, "token": ""},
               {"id": 0, "token": ""}]
  var ingredients = [ {"id": 0},
                      {"id": 0}]
  var moment_id = "";

  before(function(done){
   request
    .post('localhost:8080/sessions')
    .send('{"email": "manawasp@gmail.com", "password": "Manawasp59"}')
    .set('Content-Type', 'application/json')
    .end(function(res)
    {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      expect(res.body.user.id).to.exist;
      users[0].id = res.body.user.id;
      users[0].token = res.body.token
      request
        .post('localhost:8080/sessions')
        .send('{"email": "superadmin@gmail.com", "password": "Superadmin59"}')
        .set('Content-Type', 'application/json')
        .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.token).to.exist;
        expect(res.body.user).to.exist;
        expect(res.body.user.id).to.exist;
        users[1].id = res.body.user.id;
        users[1].token = res.body.token
        request
          .post('localhost:8080/ingredients/search')
          .set('Content-Type', 'application/json')
          .set('Auth-Token', users[0].token)
          .send('{}')
          .end(function(res)
        {
          expect(res.status).to.equal(200);
          expect(res.body.ingredients).to.exist;
          expect(res.body.ingredients.length).to.equal(2);
          ingredients[0].id = res.body.ingredients[0].id
          ingredients[1].id = res.body.ingredients[1].id
          done()
        });
      });
    });
  });


  describe('CREATE Moment', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/moments')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("400: description is undefined", function(done){
     request
      .post('localhost:8080/moments')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("description is empty");
        done()
      });
    });

    it ("400: description contain at least 3 characters", function(done){
     request
      .post('localhost:8080/moments')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"description":"a"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("description contain at least 3 characters");
        done()
      });
    });


    it ("200: create moment", function(done){
     request
      .post('localhost:8080/moments')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"description":"Pork with sugar", "ingredients": ["'+ingredients[0].id+'", "'+ingredients[1].id+'"]}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        moment_id = res.body.moment.id;
        done()
      });
    });

  })

  describe('GET Moment', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .get('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .get('localhost:8080/moments/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: get recipe information", function(done){
     request
      .get('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });

  })

  describe('UPDATE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .patch('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("403: don't have the permission", function(done){
     request
      .patch('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .patch('localhost:8080/moments/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: update description", function(done){
     request
      .patch('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"description": "Super pork and sugar"}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        done()
      });
    });
  })

  describe('DELETE Recipes', function(){

    it ("401: unhautorized if not connected", function(done){
     request
      .del('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    });

    it ("403: don't have the permission", function(done){
     request
      .del('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal("you don't have the permission");
        done()
      });
    });

    it ("404: resource not found", function(done){
     request
      .del('localhost:8080/moments/dedplepf')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("resource not found");
        done()
      });
    });

    it ("200: delete moment", function(done){
     request
      .del('localhost:8080/moments/' + moment_id)
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal("moment removed");
        done()
      });
    });
  })

  describe('SEARCH Recipe', function(){

    it ("200: create moment", function(done){
     request
      .post('localhost:8080/moments')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"description":"Pork with sugar", "ingredients": ["'+ingredients[0].id+'", "'+ingredients[1].id+'"]}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        moment_id = res.body.moment.id;
        done()
      });
    });

    it ("401: unhautorized if not connected", function(done){
     request
      .post('localhost:8080/moments/search')
      .set('Content-Type', 'application/json')
      .send('{}')
      .end(function(res)
      {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal("you need to be connected");
        done()
      });
    })

    it ("200: search", function(done){
     request
      .post('localhost:8080/moments/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.moments).to.exist;
        expect(res.body.moments.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search by creator", function(done){
     request
      .post('localhost:8080/moments/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"user_id":"'+users[1].id+'"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.moments).to.exist;
        expect(res.body.moments.length).to.equal(1);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(1);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search by creator without post", function(done){
     request
      .post('localhost:8080/moments/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[1].token)
      .send('{"user_id":"'+users[0].id+'"}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.moments).to.exist;
        expect(res.body.moments.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(0);
        expect(res.body.limit).to.exist;
        expect(res.body.limit).to.be.an('number');
        done()
      });
    });

    it ("200: search without pattern + offset", function(done){
     request
      .post('localhost:8080/moments/search')
      .set('Content-Type', 'application/json')
      .set('Auth-Token', users[0].token)
      .send('{"offset":1}')
      .end(function(res)
      {
        expect(res.status).to.equal(200);
        expect(res.body.moments).to.exist;
        expect(res.body.moments.length).to.equal(0);
        expect(res.body.size).to.exist;
        expect(res.body.size).to.equal(0);
        expect(res.body.offset).to.exist;
        expect(res.body.offset).to.equal(1);
        expect(res.body.limit).to.exist;
        done()
      });
    });

  });
});
