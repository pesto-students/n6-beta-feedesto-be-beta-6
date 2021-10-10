import {
	Date,
	model,
	Schema,
	Types,
	Document,
	SchemaTypeOptions,
	ObjectId,
} from "mongoose"
import { Comment, User } from ".."

export interface Answer extends Document {
	discussionId: Types.ObjectId | string
	userId: Types.ObjectId | string
	user?: User
	content: string
	upvoteIds: SchemaTypeOptions<ObjectId> | string[]
	upvoters?: User[]
	downvoteIds: SchemaTypeOptions<ObjectId> | string[]
	downvoters?: User[]
	commentIds: SchemaTypeOptions<ObjectId> | string[]
	comments: Comment[]
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Answer>(
	{
		content: { type: String, required: true },
		discussionId: { type: Schema.Types.ObjectId, ref: "Discussion", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		upvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		downvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		commentIds: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
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

schema.virtual("comments", {
	ref: "Comment",
	localField: "commentIds",
	foreignField: "_id",
})

export const AnswerModel = model<Answer>("Answer", schema)
