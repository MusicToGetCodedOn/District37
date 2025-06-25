import mongoose from "mongoose";



const Servicesshema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
},
{
    timestamps: true
});


const Service = mongoose.model('Service', Servicesshema)
export default Service