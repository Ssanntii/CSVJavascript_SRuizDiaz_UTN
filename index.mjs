import {input} from "./utils.mjs"
import {Csv} from "./models/csv.mjs"


async function mostrarCsvs() {
    csvs = await Csv.listarCsvs()
    if (csvs.length === 0) {
        console.log("No hay archivos disponibles.")
        await input("")
        return
    }
    csvs.forEach((f) => {
    console.log(f)
    })
}
async function main() {
    while (true){
        console.clear()
        console.log("\tMENÚ PRINCIPAL")
        console.log("===============================")
        console.log("1. Nuevo Archivo")
        console.log("2. Leer Archivo")
        console.log("3. Actualizar Archivo")
        console.log("4. Eliminar Archivo")
        console.log("5. Salir")
        console.log("===============================")

        const option = await input("Seleccione una opción: ")

        switch (option) {
            case "1":
                console.clear()
                console.log("\tCREAR ARCHIVO")
                console.log("===============================")
                let crear = await input("Ingrese el nombre del archivo: ")
                const nCrear= crear.toLowerCase().trim().replaceAll(".csv", "").replaceAll(" ", "_")
                await Csv.crearCsv(nCrear)
                await input("")
                break
            case "2":
                console.clear()
                console.log("\tLEER ARCHIVO")
                console.log("===============================")
                const f = await Csv.listarCsvs()
                if (f.csvs.length === 0) {
                    console.log("No hay archivos disponibles.")
                    await input("")
                    continue
                }
                f.csvs.forEach((f) => {
                    console.log(f)
                })
                console.log("===============================")
                let leer = await input("Seleccione el archivo: ")
                const nLeer = leer.toLowerCase().trim().replaceAll(".csv", "")
                console.clear()
                await Csv.leerCsv(nLeer)
                await input("")
                break
            case "3":
                console.clear()
                console.log("\tACTUALIZAR ARCHIVO")
                console.log("===============================")
                console.log("1. Agregar datos")
                console.log("2. Actualizar datos")
                console.log("3. Eliminar datos")
                console.log("4. Volver al menú principal")
                console.log("===============================")
                let opcion = await input("Seleccione una opción: ")
                switch (opcion) {
                    case "1":
                        console.clear()
                        console.log("\tAGREGAR DATOS")
                        console.log("===============================")
                        csvs = await Csv.listarCsvs()
                        if (csvs.length === 0) {
                            console.log("No hay archivos disponibles.")
                            await input("")
                            continue
                        }
                        csvs.forEach((f) => {
                            console.log(f)
                        })
                        console.log("===============================")
                        let fAdd = await input("Ingrese el nombre del archivo: ")
                        const nAdd = fAdd.toLowerCase().trim().replaceAll(".csv", "")
                        break
                    case "2":
                        console.clear()
                        console.log("\tACTUALIZAR DATOS")
                        console.log("===============================")
                                                csvs = await Csv.listarCsvs()
                        if (csvs.length === 0) {
                            console.log("No hay archivos disponibles.")
                            await input("")
                            continue
                        }
                        csvs.forEach((f) => {
                            console.log(f)
                        })
                        console.log("===============================")
                        let fUp = await input("Ingrese el nombre del archivo: ")
                        break
                    case "3":
                        console.clear()
                        console.log("\tELIMINAR DATOS")
                        console.log("===============================")
                        csvs = await Csv.listarCsvs()
                        if (csvs.length === 0) {
                            console.log("No hay archivos disponibles.")
                            await input("")
                            continue
                        }
                        csvs.forEach((f) => {
                            console.log(f)
                        })
                        console.log("===============================")
                        let fDel = await input("Ingrese el nombre del archivo: ")
                        break
                    case "4":
                        break
                    default:
                        console.clear()
                        console.log("Opción no válida. Intente de nuevo.")
                        await input("")
                }
                break
            case "4":
                break
            case "5":
                console.clear()
                console.log("Saliendo del programa...")
                await input("")
                return
            default:
                console.clear()
                console.log("Opción no válida. Intente de nuevo.")
                await input("")
        }
    }
}

main()
