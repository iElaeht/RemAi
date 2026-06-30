import fs from 'fs'; // Importamos el sistema de archivos de Node

async function run() {
  const response = await fetch('https://api.mangadex.org/manga/tag');
  const { data } = await response.json();
  
  const tagMap = data.reduce((acc: any, tag: any) => {
    acc[tag.attributes.name.en] = tag.id;
    return acc;
  }, {});

  // Esto crea un archivo nuevo llamado 'tags_output.json' en tu raíz
  fs.writeFileSync('tags_output.json', JSON.stringify(tagMap, null, 2));
  console.log("¡Listo! Revisa el archivo 'tags_output.json' en la raíz de tu proyecto.");
}

run();