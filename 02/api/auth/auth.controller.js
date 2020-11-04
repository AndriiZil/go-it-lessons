const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const UserModel = require('./auth.model');

class AuthController {

    static async signUpUser(req, res, next) {
        try {
            const existingUser = await UserModel.findOne({ email: req.body.email });

            if (existingUser) {
                return res.status(422).send({ message: 'User alredy exists' });
            }

            const user = await UserModel.create(req.body);

            await AuthController.sendVerificationEmail(user);

            return res.send({ email: user.email });
        } catch (err) {
            next(err);
        }
    }

    static async signInUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).send({ message: 'User was not found' });
            }

            if (user.password !== password) {
                return res.status(422).send({ message: 'password does not match' });
            }

            if (user.status !== 'verified') {
                return res.send({ messag: 'User was not verified' });
            }


            return res.send({ token: 'Bearer 6as5d95a2s3d2as.a4sd6a5s6d5a6sd.54s6das6da6ds' });
        } catch (err) {
            next(err);
        }
    }

    static async getUsers(req, res, next) {
        try {

            const users = await UserModel.find();
            
            const preapredUsers = AuthController.prepareUserResponse(users);

            return res.send(preapredUsers);

        } catch(err) {
            next(err);
        }
    }

    static async verifyEmail(req, res, next) {
        try {
            const verificationToken = req.params.token;

            const userToVerify = await UserModel.findOne({ verificationToken });

            if (!verificationToken) {
                return res.status(404).send({ message: 'User was not found' });
            }

            await AuthController.verifyUser(userToVerify._id);

            return res.send({ message: 'User was verified' });
        } catch(err) {
            next(err);
        }
    }

    static async verifyUser(userId) {
        try {
            await UserModel.findByIdAndUpdate(userId, {
                status: 'verified',
                verificationToken: null
            });

            return 'success';
        } catch (err) {
            console.log(err);
        }
    }

    static async sendVerificationEmail(user) {
        const verificationToken = await AuthController.saveVerificationToken(user._id);

        console.log('verificationToken', verificationToken)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASSWORD
            }
          });

          const verificationUrl = `http://localhost:${process.env.PORT}/auth/verify/${verificationToken}`;

          console.log('verificationUrl', verificationUrl);
        
          const msg = await transporter.sendMail({
            from: process.env.NODEMAILER_USER,
            to: user.email,
            subject: "Email Verification",
            html: `<a href='${verificationUrl}'>Click here</a>`,
          });

          return transporter.sendMail(msg);
    }

    static async saveVerificationToken(userId) {
        const token = uuidv4().split('-').join('');

        try {
            await UserModel.findByIdAndUpdate(userId, { verificationToken: token });
        } catch (err) {
            console.log(err);
        }

        return token;
    }

    static prepareUserResponse(users) {
        return users.map(({ status, _id, email }) => {
            return {
                _id,
                status,
                email
            }
        })
    }

}

module.exports = AuthController;