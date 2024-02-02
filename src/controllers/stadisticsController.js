const { User, Buy, Product,Categorie } = require("../db");
const {
  userActiveDesactive,
  monthlyIncomeForTheYear,
  historicalAmountSales,
} = require("../utils/generic_functions");

const totalUsersStadistics = async () => {
  try {
    const total = await User.findAll();
    const response = userActiveDesactive(total);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const monthlyIncome = async (type, actualYear) => {
  try {
    const allBuys = await Buy.findAll();
    const amountForYear = monthlyIncomeForTheYear(allBuys, type, actualYear);
    return amountForYear;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const historicalTotalSales = async (actualYear) => {
  try {
    const allBuys = await Buy.findAll();
    const historicalAmount = historicalAmountSales(allBuys, actualYear);
    return historicalAmount;
  } catch (error) {
    throw new Error(error);
  }
};
const getTen= async()=>{
  try {
    const productosConComprasYCategorias = await Product.findAll({
      include: [
        {
          model: Buy, // Incluye las compras
        },
        {
          model: Categorie, // Incluye las categorías
          as:"Categories"
        },
      ],
    });

    // Mapea los productos y cuenta la cantidad de compras
    const productosConConteoCompras = productosConComprasYCategorias.map((producto) => ({
      id: producto.id,
      name: producto.name, // Ajusta esto a la propiedad adecuada en tu modelo de Product
      price:producto.price,
      image: producto.image,
      totalAmount: producto.Buys.length, // Obtén la cantidad de compras
      categories:producto.Categories,
    }));

    // Ordena los productos por la cantidad de compras en orden descendente
    productosConConteoCompras.sort((a, b) => b.totalAmount - a.totalAmount);

    // Obtiene los 10 productos principales
    const productosTop10 = productosConConteoCompras.slice(0, 10);
    const productosTop3 = productosConConteoCompras.slice(0, 3);
    const top={
      labels:[],
      totalAmount:[],
      categories:"",
      top3: productosTop3
    }
    for( const product of productosTop10 ){
      top.labels.push(product.name) 
      top.totalAmount.push(product.totalAmount)
      top.categories=product.categories[0].name
    }

    return top;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

module.exports = {
  totalUsersStadistics,
  monthlyIncome,
  getTen,
  historicalTotalSales,
};
