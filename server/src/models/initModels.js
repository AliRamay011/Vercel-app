// server/src/models/initModels.js
import _admins from "./admin.js";
import _customers from "./customers.js";
import _plans from "./plans.js";
import _invoices from "./invoices.js";
import _expenses from "./expense.js";
import _staff from "./staff.js";
import _coverage_area from "./CoverageArea.js";


const initModels = (sequelize) => {
  //  Initialize all models
  const admins = _admins(sequelize);
  const customers = _customers(sequelize);
  const plans = _plans(sequelize);
  const invoices = _invoices(sequelize);
  const Expense = _expenses(sequelize);
  const Staff = _staff(sequelize);
  const CoverageArea = _coverage_area(sequelize);


  return {
    admins,
    customers,
    plans,
    invoices,
    Expense,
    Staff ,
    CoverageArea
  };
};

export default initModels;
