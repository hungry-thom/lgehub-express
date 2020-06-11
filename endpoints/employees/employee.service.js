const model = require('./employee.rethinkdb.model.js');

module.exports = {
  newEmployee,
  getEmployeeList,
  employeeListForSchedule
};

async function employeeListForSchedule () {
  console.log('+++empL4S')
  const empList = await getEmployeeList()
  // sort list
  let positions = {
    RestaurantManager: [],
    Server: [],
    Cook: [],
    Assistant: [],
    Secretary: [],
    MeatshopManager: [],
    Butcher: [],
    Apprentice: [],
    FarmManager: [],
    Farmhand: [],
    Owner: [],
    Other: []
  }
  for (emp in empList) {
    if (positions[empList[emp].position]) {
      positions[empList[emp].position].push(empList[emp])
    } else {
      positions['Other'].push(empList[emp])
    }
  }
  let sortedList = [
    ...positions.RestaurantManager,
    ...positions.Server,
    {},
    ...positions.Cook,
    ...positions.Assistant,
    {},
    ...positions.Secretary,
    ...positions.MeatshopManager,
    ...positions.Butcher,
    ...positions.Apprentice,
    {},
    ...positions.FarmManager,
    ...positions.Farmhand,
    {},
    ...positions.Owner,
    ...positions.Other
  ]
  console.log('sorted', positions.RestaurantManager)
  return sortedList
}

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

