const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose.promise = mongoose.Promise;

mongoose.connect("mongodb://localhost/graphql-social-auth", {
    useNewUrlParser: true
});
mongoose.set("debug", true);

const {
    Schema
} = mongoose;

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    social: {
        facebookProvider: {
            id: String,
            token: String
        },
        googleProvider: {
            id: String,
            token: String
        }
    }
});

UserSchema.methods.generateJWT = () => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 100, 10)
    }, "secret");
};

UserSchema.statics.upsertFbUser = async function ({
    accessToken,
    refreshToken,
    profile
}) {
    const User = this;

    const user = await User.findOne({
        "social.facebookProvider.id": profile.id
    });

    if (!user) {
        const newUser = await User.create({
            name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
            email: profile.emails[0].value,
            "social.facebookProvider": {
                id: profile.id,
                token: accessToken
            }
        });

        return newUser;
    }

    return user;
};

UserSchema.statics.upsertGoogleUser = async function ({
    accessToken,
    refreshToken,
    profile
}) {
    const User = this;

    const user = await User.findOne({
        "social.googleProvider.id": profile.id
    });

    if (!user) {
        const newUser = await User.create({
            name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
            email: profile.emails[0].value,
            "social.googleProvider": {
                id: provider.id,
                token: accessToken
            }
        });

        return newUser;
    }

    return user;
};

mongoose.model("User", UserSchema);