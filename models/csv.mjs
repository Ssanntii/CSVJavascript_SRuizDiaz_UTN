import fs from "fs/promises"
import {dir} from "../config/csv_init_.mjs"
import { input } from "../utils.mjs"

export class Csv{

    static async crearCsv(nombre){
        const f= await dir()
        const d= new Date()
        const dname= d.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }).replaceAll("/", "-")
        try{
            const data= await fs.readFile(`${f.dirName}/datos_${nombre}_(${dname}).csv`, "utf-8")
            if(data){
                console.log("El archivo ya existe.")
                return
            }
        }
        catch{
            try{
                await fs.writeFile(`${f.dirName}/datos_${nombre}_(${dname}).csv`, "ID,Producto,Stock(U),Precio($)\n")
                console.log("Archivo creado exitosamente.")
            }
            catch(e){
                if(!(e.code !== "ENOENT")){
                    console.log("Error al crear el archivo.")
                }
        }
    }
}
    static async listarCsvs(){
        try{
            const f = await dir()
            const csvs = f.files.filter (file => file.endsWith(".csv"))

            return { csvs, dirName: f.dirName }
        }
        catch(e){
            console.log("Error al listar los archivos.")
            console.log(e)
            return { csvs: [], dirName: "" }
        }
    }

    static async leerCsv(nombre){
        try{
            const { csvs, dirName } = await this.listarCsvs()
            const file = csvs.find(f => {
                const match = f.match(/^datos_(.+?)_\(\d{1,4}-\d{1,2}-\d{1,4}\)\.csv$/)
                if (!match) return false
                return match[1] === nombre
            })
            if(!file){
                return "no_existe"
            }
            const data = await fs.readFile(`${dirName}/${file}`, "utf-8")
            let rows = data.split("\n").filter(r => r.trim() !== "")
            if (rows.length <= 1) {
                return "vacio"
            }
            const table = rows.map(r => r.split(","))
            const colWidths = []
            table.forEach(row => {
                row.forEach((cell, i) => {
                    colWidths[i] = Math.max(colWidths[i] || 0, cell.length)
                })
            })
            table.forEach((row, idx) => {
                const line = row.map((cell, i) => cell.padEnd(colWidths[i], " ")).join(" | ")
                console.log(line)
                if (idx === 0) {
                    const sep = colWidths.map(w => "-".repeat(w)).join("-+-");
                    console.log(sep)
                }
            });
            return "ok"
        }
        catch(e){
            console.log("No se encontró el archivo.")
            return "no_existe"
        }
    }

    static async actualizarCsv(action, nombre, producto, stock, precio) {
        try{
            const { csvs, dirName } = await this.listarCsvs()
            const file = csvs.find(f => {
                const match = f.match(/^datos_(.+?)_\(\d{1,4}-\d{1,2}-\d{1,4}\)\.csv$/)
                if (!match) return false
                return match[1] === nombre
            })
            if (!file) {
                console.log("No se encontró el archivo.")
                return
            }
            switch(action){
                case "add":
                    try{
                        const data = await fs.readFile(`${dirName}/${file}`, "utf-8")
                        const rows = data.split("\n").filter(r => r.trim() !== "" && !r.startsWith("ID,"))
                        const newId = rows.length ? parseInt(rows[rows.length - 1].split(",")[0]) + 1 : 1
                        const newRow = `${newId},${producto},${stock},${precio}\n`
                        const existe = rows.some(r => r.split(",")[1].toLowerCase() === producto.toLowerCase())
                        if (existe) {
                            console.clear()
                            console.log("\tAGREGAR DATOS")
                            console.log("===============================")
                            console.log("Producto ya existente")
                            console.log("===============================")
                            await input("")
                            break
                        }
                        await fs.appendFile(`${dirName}/${file}`, newRow)
                        console.log("Datos agregados exitosamente.")
                        await input("")
                        break
                    }
                    catch(e){
                        console.log("Error al agregar los datos.")
                        console.log(e)
                        return
                    }
                case "update":
                    try {
                        const data = await fs.readFile(`${dirName}/${file}`, "utf-8")
                        const rows = data.split("\n").filter(r => r.trim() !== "" && !r.startsWith("ID,"))
                        let found = false
                        const updatedRows = []
                        for (let row of rows) {
                            let cols = row.split(",")
                            if (cols[1].toLowerCase() === producto.toLowerCase()) {
                                found = true
                                console.log(`Producto encontrado: ${cols[1]} | Stock: ${cols[2]} | Precio: ${cols[3]}`)
                                console.log("===============================")
                                let nuevoStock = await input(`\tNuevo stock (actual: ${cols[2]})\nSi no desea modificarlo, pulse Enter para continuar: `)
                                if (nuevoStock.trim() === "") nuevoStock = cols[2]
                                let nuevoPrecio = await input(`\tNuevo precio (actual: ${cols[3]})\nSi no desea modificarlo, pulse Enter para continuar: `)
                                if (nuevoPrecio.trim() === "") nuevoPrecio = cols[3]
                                cols[2] = nuevoStock
                                cols[3] = nuevoPrecio.replaceAll("$", "").replaceAll(",", ".")
                            }
                            updatedRows.push(cols.join(","))
                        }
                        if (!found) {
                            console.log("No se encontró el producto.")
                            console.log("===============================")
                            await input("")
                            break
                        }
                        await fs.writeFile(`${dirName}/${file}`, `ID,Producto,Stock(U),Precio($)\n${updatedRows.join("\n")}\n`)
                        console.log("Datos actualizados exitosamente.")
                        await input("")
                        break
                    } catch (e) {
                        console.log("Error al actualizar los datos.")
                        console.log(e)
                        return
                    }
                case "delete":
                    try {
                        const data = await fs.readFile(`${dirName}/${file}`, "utf-8")
                        const rows = data.split("\n").filter(r => r.trim() !== "" && !r.startsWith("ID,"))

                        const idEliminar = await input("Ingrese el ID del producto a eliminar: ")
                        const filteredRows = rows.filter (r => r.split(",")[0] !== idEliminar.trim())
                        if (filteredRows.length === rows.length) {
                            console.log("No se encontró un producto con ese ID.")
                            await input("")
                            break
                        }
                        await fs.writeFile(
                            `${dirName}/${file}`,
                            `ID,Producto,Stock(U),Precio($)\n${filteredRows.join("\n")}\n`
                        )
                        console.log("Producto eliminado exitosamente.")
                        await input("")
                        break
                    } catch (e) {
                        console.log("Error al eliminar el producto.")
                        console.log(e)
                        return
                    }
            }
        }
        catch(e){
            console.log("Error al leer el archivo.")
            console.log(e)
            return
        }
        
    }

    static async borrarCsv(nombre){
        try{
            const { csvs, dirName } = await this.listarCsvs()
            const file = csvs.find(f => {
                const match = f.match(/^datos_(.+?)_\(\d{1,4}-\d{1,2}-\d{1,4}\)\.csv$/)
                if (!match) return false
                return match[1] === nombre
            })
            if (!file) {
                console.log("No se encontró el archivo.")
                return
            }
            const sure= await input(`¿Está seguro de que desea eliminar el archivo ${file}? (y/n): `) 
            if (sure.toLowerCase() !== "y") {
                console.log("Operación cancelada.")
                await input("")
                return
            }
            await fs.unlink(`${dirName}/${file}`)
            console.log("Archivo eliminado exitosamente.")
            await input("")
        }
        catch(e){
            console.log("Error al eliminar el archivo.")
            console.log(e)
        }
    }
}
