const create = async (req, res, next) => {
  try {
    const commentService = req.container.resolve('commentService');
    const comment = await commentService.create(req.body, req.user);
    res.status(201).json({
      success: true,
      comment,
      message: 'Comment created successfuly'
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

const update = async (req, res, next) => {
  try {
    const commentService = req.container.resolve('commentService');
    const comment = await commentService.update(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const commentService = req.container.resolve('commentService');
    const comment = await commentService.delete(req.params.id, req.user);
    res.status(201).json({
      success: true,
      comment,
      message: 'Comment deleted successfuly'
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

module.exports = {
  create,
  update,
  deleteOne
};
