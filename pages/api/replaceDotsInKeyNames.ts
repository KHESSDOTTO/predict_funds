import { connect } from "@/database/database.config";
import Predictions4Weeks1Model from "@/database/models/predictions4WeeksModel1";
import Predictions4Weeks2Model from "@/database/models/predictions4WeeksModel2";
import Predictions4Weeks3Model from "@/database/models/predictions4WeeksModel3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function ReplaceDotsInKeyNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    const cursor = Predictions4Weeks2Model.find().cursor();

    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      const updatedDoc: { [key: string]: any } = {};

      // Iterate over each field in the document
      for (const key in doc._doc) {
        if (doc._doc.hasOwnProperty(key)) {
          let newKey = key.replace(/_/g, "__").replace(/\./g, "_");
          updatedDoc[newKey] = doc._doc[key];
        }
      }

      // Update the document with the new field names
      await Predictions4Weeks2Model.updateOne(
        { _id: doc._id },
        { $set: updatedDoc }
      );
    }

    console.log("Field names updated successfully.");
    res.status(200).json({ message: "Field names updated successfully." });
  } catch (err) {
    console.error("Error updating field names:", err);
    res
      .status(500)
      .json({ message: "Error updating field names.", error: err });
  }
}
