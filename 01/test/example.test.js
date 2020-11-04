const { expect } = require('chai');
const sinon = require('sinon');

const { UserService, UserModel } = require('../users-service');

const userUservice = new UserService();

function add(a, b) {
    return a + b;
}

function getData() {
    return {
        name: 'Andrii',
        age: 30,
        gender: 'male',
        emailAddress: 'example@gmail.com'
    }
}


describe('User Service Tests', () => {


    describe('#createUsers()', () => {
        let sandbox, body;

        before(() => {
            sandbox = sinon.createSandbox();
            body = {
                email: 'example@test.com',
                password: '123456'
            }
        });

        afterEach(() => {
            sandbox.restore();
        });

        // beforeEach(() => {
        //     console.log('beforeEach');
        // });

        // after(() => {
        //     console.log('after')
        // });


        it('should create user', async () => {

            const findUserStub = sandbox.stub(UserModel, 'findOne').resolves(null);

            const createUser = sandbox.stub(UserModel, 'create').resolves({
                id: 5, name: 'newUser', age: 21
            });

            const result = await userUservice.createUser(body);

            expect(result).to.be.an('object');
            expect(findUserStub.callCount).to.equal(1);
            expect(result).to.deep.equal({ id: 5, name: 'newUser', age: 21 });
        });

        it('should not create user if exists and throw error', async () => {
            const findUserStub = sandbox.stub(UserModel, 'findOne').resolves({
                id: 1, name: 'Bob', age: 25
            });

            const createUser = sandbox.stub(UserModel, 'create').resolves();

            try {
                await userUservice.createUser(body);
            } catch(err) {
                expect(err.message).to.be.a('string');
                expect(err.message).to.equal('User already exists');
                expect(findUserStub.callCount).to.equal(1);
                expect(createUser.callCount).to.equal(0);
            }
        });


    });

});


describe('Simple functions', () => {

    describe('#add()', () => {

        it('should add two numbers', () => {
            const result = add(2, 5);

            expect(result).to.be.equal(7);
            expect(result).to.be.a('number');

        });

    });

    describe('#getData()' , () => {

        it('shoul return an object', () => {
            const result = getData();

            expect(result).to.deep.equal({
                name: 'Andrii',
                age: 30,
                gender: 'male',
                emailAddress: 'example@gmail.com'
              });
            expect(result).to.be.an('object');
        });

    })

});
