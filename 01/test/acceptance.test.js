const request = require('supertest');
const { expect } = require('chai');

const server = require('../server');

describe('Acceptance Test', () => {

    afterEach(() => {
        server.close();
    });

    describe('#/users', () => {

        it('should get users', () => {

            request(server)
                .get('/users')
                .expect(200)
                .then(response => {
                    expect(response.body).to.deep.equal([
                        { id: 1, name: 'User1' },
                        { id: 2, name: 'User2' }
                    ])
                })

        });

    })

})