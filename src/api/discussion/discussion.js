const fetchAll = async (req, res, next) => {
  try {
    const discussionService = req.container.resolve('discussionService');
    const discussions = await discussionService.fetchAll(req.user);
    res.status(201).json({
      success: true,
      discussions
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

const create = async (req, res, next) => {
  try {
    const discussionService = req.container.resolve('discussionService');
    const discussion = await discussionService.create(req.body, req.user);
    res.status(201).json({
      success: true,
      discussion,
      message: 'Discussion created successfuly'
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
    const discussionService = req.container.resolve('discussionService');
    const discussion = await discussionService.update(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      discussion
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

const fetchOne = async (req, res, next) => {
  try {
    const discussionService = req.container.resolve('discussionService');
    const discussion = await discussionService.fetchOne(req.params.id, req.user);
    res.status(201).json({
      success: true,
      discussion
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
    const discussionService = req.container.resolve('discussionService');
    const discussion = await discussionService.delete(req.params.id, req.user);
    res.status(201).json({
      success: true,
      discussion,
      message: 'Discussion deleted successfuly'
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
  fetchAll,
  create,
  update,
  fetchOne,
  deleteOne
};
