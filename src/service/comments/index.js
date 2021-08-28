module.exports = class CommentService {
  constructor({ commentDbModel }) {
    this.commentDbModel = commentDbModel;
  }

  delete = async (id, user) => {
    try {
      let error;

      const oldComment = await this.commentDbModel.findById(id);

      if (!oldComment) {
        error = new Error('Comment not found');
        error.status = 404;
        throw error;
      }

      if (user.role !== 'admin' || oldComment.commentedById.toString() !== user._id.toString()) {
        error = new Error('you cannot delete this comment');
        error.status = 422;
        throw error;
      }

      await this.commentDbModel.deleteById(id);

      return { comment: id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};
