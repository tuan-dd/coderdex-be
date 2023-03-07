const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');

const getPathImages = () => {
   const __dirname = '../public/images_detail/';
   const files = fs.readdirSync(__dirname);
   let pathImages = files.map((file) => ({
      [file]: 'public/images_detail/' + file,
   }));
   return pathImages;
};

const createPokemonDb = async () => {
   let newData = await csv().fromFile('../pokemon.csv');
   newData = new Set(newData.map((item) => item));
   newData = Array.from(newData);
   newData.forEach((item, i) => (item.id = i + 1));
   let pathImages = getPathImages();

   newData = newData.map((item) => {
      pathImages.forEach((pathImage) => {
         for (let key in pathImage) {
            if (key === item.name) {
               const images = fs.readdirSync(`../${pathImage[key]}`);
               let arrayPathImages = images.map((e) =>
                  path.join(pathImage[key], e),
               );
               item.imgPaths = item.folder
                  ? item.folder.push(arrayPathImages)
                  : arrayPathImages;
            }
         }
      });
      return item;
   });
   let object = {
      count: newData.length,
      totalPages: Math.ceil(newData.length / 20),
      data: newData,
   };
   //  console.log(object);
   fs.writeFile('../db.json', JSON.stringify(object), (err, data) => {
      if (err) console.log(err.message);
      console.log('oke');
   });
};

module.exports = { createPokemonDb, getPathImages };
