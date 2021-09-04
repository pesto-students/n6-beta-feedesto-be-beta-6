import {
	Date,
	model,
	Schema,
	Types,
	Document,
	SchemaTypeOptions,
	ObjectId,
} from "mongoose"
import { Comment } from ".."

export interface Answer extends Document {
	discussionId: Types.ObjectId | string
	userId: Types.ObjectId | string
	content: string
	upvoteIds: SchemaTypeOptions<ObjectId> | string[]
	downvoteIds: SchemaTypeOptions<ObjectId> | string[]
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

export const AnswerModel = model<Answer>("Answer", schema)
