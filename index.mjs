import fs from "fs/promises"

const archivo = "datos.csv"
const fecha = new Date()

try {
    await fs.writeFile(`./csv/${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}.csv`, "ID,Producto,Stock,Precio\n")

    console.log("ha sido creado el archivo.csv")
} catch {
    // await fs.mkdir("csv")
}
// fs.readdir("./csv") `Lee` un directorio/carpeta
// fs.readFile(nombrefile)
// fs.writeFile(nombrefile, datos)
// fs.appendFile(nombrefile, datos)
// fs.unlink(nombrefile)
// fs.

