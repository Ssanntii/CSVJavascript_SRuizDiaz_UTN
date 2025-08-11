import {input} from "./utils.mjs"
import {Csv} from "./models/csv.mjs"

async function mostrarCsvs() {
    const {csvs, dirName} = await Csv.listarCsvs()

    if (!dirName || csvs.length === 0) {
        console.log("No hay archivos creados.")
        return false
    }

    csvs.forEach((f) => {
        console.log(f)
    })
    return true
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
                console.log("===============================")
                const nCrear= crear.toLowerCase().trim().replaceAll(".csv", "").replaceAll(" ", "_")
                await Csv.crearCsv(nCrear)
                await input("")
                break
            case "2":
                console.clear()
                console.log("\tLEER ARCHIVO")
                console.log("===============================")
                await mostrarCsvs()
                console.log("===============================")
                let leer = await input("Seleccione el archivo: ")
                const nLeer = leer.toLowerCase().trim().replaceAll(".csv", "")
                console.clear()
                console.log(`\tTABLA ${nLeer.toUpperCase()}`)
                console.log("===============================")
                await Csv.leerCsv(nLeer)
                console.log("===============================")
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
                        signal = await mostrarCsvs()
                        console.log("===============================")
                        if (!signal) {
                            await input("")
                            break
                        }
                        let fAdd = await input("Ingrese el nombre del archivo: ")
                        const nAdd = fAdd.toLowerCase().trim().replaceAll(".csv", "")
                        let seguir = true;
                        while (seguir) {
                            console.clear()
                            console.log("\tAGREGAR DATOS")
                            console.log("===============================")
                            const exist = await Csv.leerCsv(nAdd)
                            if (exist === false) {
                                console.log("===============================")
                                await input("")
                                seguir = false
                                break
                            }
                            console.log("===============================")
                            console.log("Datos a agregar:")
                            let product = await input("Ingrese el producto: ")
                            product = product.trim()
                            product = product.charAt(0).toUpperCase() + product.slice(1).toLowerCase()
                            let stock
                            while (true) {
                                stock = await input("Ingrese el stock(U): ")
                                stock = stock.trim()
                                if (stock !== "" && !isNaN(stock)) {
                                    stock = parseInt(stock)
                                    break
                                }
                                console.log("Stock inválido.")
                            }
                            let precio
                            while (true) {
                                precio = await input("Ingrese el precio($): ")
                                precio = precio.trim().replaceAll("$", "").replaceAll(",", ".")
                                if (precio !== "" && !isNaN(precio)) {
                                    precio = parseFloat(precio)
                                    break
                                }
                                console.log("Precio inválido.")
                            }
                            await Csv.actualizarCsv("add", nAdd, product, stock, precio)
                            let repetir;
                            while (true) {
                                repetir = await input("¿Desea cargar otro dato? (y/n): ")
                                repetir = repetir.trim().toLowerCase()
                                if (repetir === "y" || repetir === "n") break
                                console.log("Opción no válida. Ingrese 'y' para sí o 'n' para no.")
                            }
                            if (repetir === "n") {
                                seguir = false; // Sale del bucle externo
                            }
                        }
                        break
                    case "2":
                        console.clear()
                        console.log("\tACTUALIZAR DATOS")
                        console.log("===============================")
                        const signal = await mostrarCsvs()
                        console.log("===============================")
                        if (!signal) {
                            await input("")
                            break
                        }
                        let fUp = await input("Ingrese el nombre del archivo: ")
                        console.clear()
                        console.log(`\tACTUALIZAR DATOS EN ${fUp.toUpperCase()}`)
                        console.log("===============================")
                        const nUp = fUp.toLowerCase().trim().replaceAll(".csv", "")
                        const exist = await Csv.leerCsv(nUp)
                        if (exist === false) {
                            await input("")
                            break
                        }
                        console.log("===============================")
                        let producto = await input("Ingrese el nombre del producto a actualizar: ")
                        producto = producto.trim()
                        producto = producto.charAt(0).toUpperCase() + producto.slice(1).toLowerCase()
                        console.clear()
                        console.log(`\tACTUALIZAR DATOS DEL PRODUCTO ${producto.toUpperCase()}`)
                        console.log("===============================")
                        // Los valores de stock y precio pueden ser "" para que Csv.actualizarCsv los pida
                        await Csv.actualizarCsv("update", nUp, producto, "", "")
                        break
                    case "3":
                        console.clear()
                        console.log("\tELIMINAR DATOS")
                        console.log("===============================")
                        await mostrarCsvs()
                        console.log("===============================")
                        let fDel = await input("Ingrese el nombre del archivo: ")
                        break
                    case "4":
                        break
                    default:
                        console.clear()
                        console.log("Opción no válida. Intente de nuevo.")
                        await input("")
                        break
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
