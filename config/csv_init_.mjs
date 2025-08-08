import fs from "fs/promises"

export const dir = async () => {
    try {
        await fs.readdir("csvs", "utf-8")
    } catch (error) {
        console.log("El directorio no esta creado. Creando directorio.")
        await fs.mkdir("csvs")

    }
}
// fs.readdir("./csv") `Lee` un directorio/carpeta
// fs.readFile(nombrefile)
// fs.writeFile(nombrefile, datos)
// fs.appendFile(nombrefile, datos)
// fs.unlink(nombrefile)
// fs.mkdir("csv") // Crea un directorio/carpeta
// fs.rmdir("csv") // Elimina un directorio/carpeta