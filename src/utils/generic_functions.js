const sumArr = async(arr) => {
  if(!arr){
    throw new Error("No se paso ninguna matriz para sumar")
  }
  let total = 0;
  for (const num of arr) {
    total = total + Number(num.amount);
  }
  return total;
}

const userActiveDesactive = async(users) => {
  if(!users){
    throw new Error("No se paso ninguna matriz de usuarios")
  }
  let active = 0;
  let desactive = 0;
  for (const user of users) {
    if(user.isActive){
      active = active + 1;
    } else {
      desactive = desactive + 1; 
    }
  }
  const stadistics = {
    active: active,
    desactive: desactive,
    totalUsers: users.length,
  }
  return stadistics;
}

const monthlyIncomeForTheYear = (payload, type, actualYear) => {
  if(!payload || !type || !actualYear){
    throw new Error("Faltan parametros")
  }
  switch (type) {
    case "amount":
      let amountForMonth =  new Array(12).fill(0);
      for (const buy of payload) {
        const mes = buy.createdAt.getMonth();
        const year = buy.createdAt.getFullYear();
        if (year === actualYear) {
          amountForMonth[mes] += Number(buy.amount);
        }
      }
      return amountForMonth;
    default:
      break;
  }
}

const historicalAmountSales = (buys, actualYear) => {
  if(!buys){
    throw new Error("No se paso ningun parametro")
  } 
  let total  = 0;
  for (const buy of buys) {
    const year = buy.createdAt.getFullYear();
    if(year === actualYear){
      total = total + Number(buy.amount);
    } 
  }
  return total;
}

//funcion para validar el nombre
const normalizarCoincidencia = (name) => {
  return name.normalize("NFD")//para normalizar los caracteres (convierte Á en A, é en e, etc...) NFD :: Normalization Form Canonical Decomposition
          .replace(/[\u0300-\u036f]/g, "")//regExp
          .toLowerCase();
}

module.exports = {
  sumArr,
  userActiveDesactive,
  monthlyIncomeForTheYear,
  historicalAmountSales,
  normalizarCoincidencia,
}