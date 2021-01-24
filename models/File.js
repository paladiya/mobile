const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileName: { type: String, required: true },
    userName: { type: String, required: true },
    fileTags: { type: Array, required: true },
    fileOriginName:{type:String, required:true},
    downloads: { type: Number, default: 0 },
    types: { type: String, required: true },
    size: { type: Number, required: true }
  },

  { timestamps: true }
)

module.exports = mongoose.model('File', fileSchema)
