import fs from "fs/promises"

export const dir = async () => {
    const dirName = "csvs"
    try {
        const files = await fs.readdir(dirName, "utf-8")
        return { files, dirName }
    } catch (error) {
        console.log("El directorio no esta creado. Creando directorio.")
        await fs.mkdir(dirName)
        return { files: [], dirName }
    }
}



// fs.readdir("./csv") `Lee` un directorio/carpeta
// fs.readFile(nombrefile)
// fs.writeFile(nombrefile, datos)
// fs.appendFile(nombrefile, datos)
// fs.unlink(nombrefile)
// fs.mkdir("csv") // Crea un directorio/carpeta
// fs.rmdir("csv") // Elimina un directorio/carpeta