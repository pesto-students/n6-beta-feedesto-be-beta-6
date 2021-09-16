import { model, Schema, Document, Date, SchemaTypeOptions, ObjectId } from "mongoose"
import { User } from ".."

export interface Comment extends Document {
	answerId: Schema.Types.ObjectId
	userId: Schema.Types.ObjectId
	user?: User
	content: string
	upvoteIds: SchemaTypeOptions<ObjectId> | string[]
	upvoters?: User[]
	downvoteIds: SchemaTypeOptions<ObjectId> | string[]
	downvoters?: User[]
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Comment>(
	{
		content: { type: String, required: true },
		answerId: { type: Schema.Types.ObjectId, ref: "Answer", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		upvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		downvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
	},
	{ timestamps: true },
)

schema.virtual("user", {
	ref: "User",
	localField: "userId",
	foreignField: "_id",
	justOne: true,
})

schema.virtual("upvoters", {
	ref: "User",
	localField: "upvoteIds",
	foreignField: "_id",
})

schema.virtual("downvoters", {
	ref: "User",
	localField: "downvoteIds",
	foreignField: "_id",
})

export const CommentModel = model<Comment>("Comment", schema)
