import mongoose, {Schema} from "mongoose";

const seguidorSchema = new Schema({
    usuarioID : {type: String, require: true },
    usuarioSeguidorID : {type: String, require: true}
})

export const SeguidorModel = (mongoose.models.seguidores || 
    mongoose.model('seguidores', seguidorSchema))