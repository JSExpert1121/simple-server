const model = require('./model');

module.exports = {
  getHealth,
  putProperty,
  getProperty,
  deleteProperty
}

async function getHealth(req, res, next) {
  res.json({ success: true });
}

async function putProperty(req, res, next) {
  try {
    const studentId = req.params.studentId;
    const propPath = req.params[0];

    const result = await model.setProperty(studentId, propPath, req.body)
    res.json({ success: result });
  } catch (error) {
    next();
  }
}

async function getProperty(req, res, next) {
  try {
    const studentId = req.params.studentId;
    const propPath = req.params[0];

    const property = await model.getProperty(studentId, propPath);
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    next();
  }
}

async function deleteProperty(req, res, next) {
  try {
    const studentId = req.params.studentId;
    const propPath = req.params[0];

    const result = await model.deleteProperty(studentId, propPath);
    res.json({ success: result });
  } catch (error) {
    console.log(error);
    next();
  }
}
