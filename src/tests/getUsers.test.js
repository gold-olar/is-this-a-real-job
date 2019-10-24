import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

const signinUrl = '/api/v1/auth/signin';
let currentToken;


describe('Return Users', () => {
  before((done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'admin@mail.com', // valid login details
        password: '123456',
      })
      .end((error, res) => {
        currentToken = res.body.payload.token;
        done();
      });
  });
  it('it should return all the users in the database', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .set('Authorization', currentToken)
      .end((error, res) => {
        expect(res).to.have.status(200);
        expect(res.body.payload[0]).to.have.property('userId');
        expect(res.body.payload[0]).to.have.property('email');
        done();
      });
  });
});


describe('Return Users', () => {
  before((done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'johndoe@mail.com', // valid login details
        password: '123456',
      })
      .end((error, res) => {
        currentToken = res.body.payload.token;
        done();
      });
  });
  it('it should not return all the users if not admin', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .set('Authorization', currentToken)
      .end((error, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Forbidden access');
        done();
      });
  });
});
