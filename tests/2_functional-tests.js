/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', async() => {
       let res = await chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })

        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'open');
        assert.property(res.body, 'status_text');
        assert.property(res.body, '_id');
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Title')
        assert.equal(res.body.issue_text, 'text')
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
        assert.equal(res.body.assigned_to, 'Chai and Mocha')
        assert.equal(res.body.status_text, 'In QA')
        assert.equal(res.body.open, true)
        assert.isDefined(res.body.created_on)
        assert.isDefined(res.body.updated_on)
      });
      
      test('Required fields filled in', async () => {
        let res = await chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in',
        })

        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'open');
        assert.property(res.body, 'status_text');
        assert.property(res.body, '_id');
        assert.equal(res.status, 200)
        assert.equal(res.body.issue_title, 'Title')
        assert.equal(res.body.issue_text, 'text')
        assert.equal(res.body.created_by, 'Functional Test - Required fields filled in')
        assert.equal(res.body.assigned_to, "")
        assert.equal(res.body.status_text, "")
        assert.equal(res.body.open, true)
        assert.isDefined(res.body.created_on)
        assert.isDefined(res.body.updated_on)
      });
      
      test('Missing required fields', async () => {

        let res = await chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })

        assert.equal(res.text, 'missing inputs')
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', () => {
      
      test('No body', async() => {

        let testId = await chai.request(server)
        .get('/api/issues/test')
        .then(result => result.body[0]._id)

        let res = await chai.request(server)
        .put('/api/issues/test/')
        .send({'_id': testId})

        assert.equal(res.status, 200)
        assert.equal(res.text, 'no updated field sent')
      });
      
      test('One field to update', async() => {
        let testId = await chai.request(server)
        .get('/api/issues/test')
        .then(result => result.body[0]._id)

        let res = await chai.request(server)
        .put('/api/issues/test/')
        .send({
          '_id': testId,
          open: false
        })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'successfully updated')
      });
      
      test('Multiple fields to update', async() => {
        let testId = await chai.request(server)
        .get('/api/issues/test')
        .then(result => result.body[0]._id)

        let res = await chai.request(server)
        .put('/api/issues/test/')
        .send({
          '_id': testId,
          open: false,
          issue_title: 'Changed Title'
        })

        assert.equal(res.status, 200)
        assert.equal(res.text, 'successfully updated')
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', async() => {
        await chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title2',
          issue_text: 'text2',
          created_by: 'Filter Test',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })

        let res = await chai.request(server)
        .get('/api/issues/test')
        .query({issue_title: 'Title2'})

        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', async() => {
        await chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title3',
          issue_text: 'text3',
          created_by: 'Filter Test',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })

        let res = await chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'Title3',
          issue_text: 'text3',
          created_by: 'Filter Test'
        })

        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', async() => {
        let res = await chai.request(server)
        .delete('/api/issues/test')
        .send({})

        assert.equal(res.status, 200)
        assert.equal(res.text, '_id error')
      });
      
      test('Valid _id', async() => {

        let testId = await chai.request(server)
        .get('/api/issues/test')
        .then(result => result.body[0]._id)

        let res = await chai.request(server)
        .delete('/api/issues/test')
        .send({_id: testId})

        assert.equal(res.status, 200)
        assert.equal(res.text, `deleted ${testId}`)
      });
      
    });

});
