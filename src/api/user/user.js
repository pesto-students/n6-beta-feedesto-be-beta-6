const fetchAll = async (req, res, next) => {
  try {
    const userService = req.container.resolve('userService');
    const users = await userService.fetchAll(req.user);
    res.status(201).json({
      success: true,
      users
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
    const userService = req.container.resolve('userService');
    const user = await userService.update(req.params.id, req.body, req.user);
    res.status(201).json({
      success: true,
      user,
      message: 'User updated successfully'
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
    const userService = req.container.resolve('userService');
    const user = await userService.fetchOne(req.params.id, req.user);
    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
      );
  }
};

//   const deleteOne = async (req, res, next) => {
//     try {
//       const userService = req.container.resolve('userService');
//       const user = await userService.delete(req.params.id, req.user);
//       res.status(201).json({
//         success: true,
//         user,
//         message: 'Discussion deleted successfuly'
//       });
//     } catch (error) {
//       res
//         .status(error.status || 500)
//         .json(
//           error.status ? { success: false, message: error.message } : { success: false, message: 'Something went wrong' }
//         );
//     }
//   };

module.exports = {
  fetchAll,
  update,
  fetchOne
  // deleteOne
};
