const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema(
  {
    blocks: [
      {
        tag: {
          type: String,
          required: true,
        },
        html: {
          type: String,
          required: false,
        },
        imageUrl: {
          type: String,
          required: false,
        },
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ispublic : {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
