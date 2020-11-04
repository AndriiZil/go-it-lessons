const UserModel = {
    create: function({ email, password }) {
        return new Promise((res, rej => {
            res('result');
        }))
    },
    findOne: function({ email }) {
        return new Promise((res, rej => {
            res('result');
        }))
    }
}


class UserService {


    async createUser(body) {
        const { email, password } = body;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = await UserModel.create({ email, password });

        return newUser;
    }



}

module.exports = {
    UserService,
    UserModel
};