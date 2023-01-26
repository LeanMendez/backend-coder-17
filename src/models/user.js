import mongoose from 'mongoose';

mongoose.set('strictQuery', true)
const userCollection = 'users';

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
    versionKey: false
}
)

export const UserModel = mongoose.model(userCollection, userSchema)