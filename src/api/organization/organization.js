const fetchAll = async (req, res, next) => {
  try {
    const organizationService = req.container.resolve('organizationService');
    const organizations = await organizationService.fetchAll();
    res.status(201).json({
      success: true,
      organizations
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
  fetchAll
};
