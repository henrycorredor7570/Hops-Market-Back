const { Product, Categorie } = require("../db");

const saveAllData = async (data) => {
  try {
    for (const beer of data) {
      const [newBeer, created] = await Product.findOrCreate({
        where: {
          name: beer.name,
        },
        defaults: {
          name: beer.name,
          description: beer.description,
          image: beer.image,
          country: beer.country,
          price: beer.price,
          alcoholContent: beer.alcoholContent,
          stock: beer.stock,
          amountMl: beer.amountMl,
        },
      });
      if (created) {
        console.log("Nuevo producto creado");
      } else {
        throw new Error("Producto ya existente en la Base de datos");
      }

      const categorie = await Categorie.findOne({
        where: {
          name: beer.categorie,
        },
      });

      if (categorie) {
        await newBeer.addCategories(categorie);
        console.log(`Producto relacionado con categoría: ${beer.categorie}`);
      } else {
        console.log(`Categoría no encontrada: ${beer.categorie}`);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
/* const saveAllData = async (data) => {
  try {
    for (const beer of data) {
      // Verifica si beer.name tiene un valor definido antes de intentar crear el registro
      if (beer.name) {
        const newBeer = await Product.findOrCreate({
          where: {
            name: beer.name,
          },
          defaults: {
            name: beer.name,
            description: beer.description,
            image: beer.image,
            country: beer.country,
            price: beer.price,
            alcoholContent: beer.alcoholContent,
            stock: beer.stock,
            amountMl: beer.amountMl,
          },
        });
      } else {
        // Handle el caso en el que beer.name es undefined
        console.error('El campo "name" está indefinido para una cerveza.');
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}; */

const updateAllData = async () => {
  try {
    const allData = await Product.findAll();
    for (const beer of allData) {
      const numeroRandom = Math.floor(Math.random() * 1000) + 1;
      const precioRandom = Number(((Math.random() * (20 - 4)) + 4).toFixed(2));
      const newData = {
        stock: numeroRandom,
        price: precioRandom
      };
      await Product.update(newData, {
        where: {
          id: beer.id,
        },
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  saveAllData,
  updateAllData,
};
