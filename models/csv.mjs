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
            const csvs = f.files.filter(file => file.endsWith(".csv"))

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
                console.log("No se encontró el archivo.")
                return
            }
            const data = await fs.readFile(`${dirName}/${file}`, "utf-8")
            let rows = data.split("\n").filter(r => r.trim() !== "")
            rows = rows.map(r => r.split(","))

            const colWidths = []
            rows.forEach(row => {
                row.forEach((cell, i) => {
                    colWidths[i] = Math.max(colWidths[i] || 0, cell.length)
                })
            })

            rows.forEach((row, idx) => {
                const line = row.map((cell, i) => cell.padEnd(colWidths[i], " ")).join(" | ")
                console.log(line)

                if (idx === 0) {
                    const sep = colWidths.map(w => "-".repeat(w)).join("-+-")
                    console.log(sep)
                }
            })
        }
        catch(e){
            console.log("No se encontró el archivo.")
            console.log(e)
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

            }
        }
        catch(e){
            console.log("Error al leer el archivo.")
            console.log(e)
            return
        }
        
    }
}
