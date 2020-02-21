const model = require('./employee.rethinkdb.model.js');

module.exports = {
  newEmployee,
  getEmployeeList
};

async function newEmployee (details) {
  console.log('details', details);
  const resp = await model.newEmployee(details);
  console.log('===newEmployee', resp);
  return resp
}

async function getEmployeeList () {
  console.log('===getEmpList')
  const employeeList = await model.getEmployeeList(); // receives as array, no hash
  console.log('===empListResp', employeeList)
  return employeeList;
}

async function getById (id) {
  const user = await Umodel.getById(id);
  if (!user) return;
  const { hash, ...userWithoutHash } = user;
  return  userWithoutHash;
}

