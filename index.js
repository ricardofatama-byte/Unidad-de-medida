import { netsuiteRequest } from "./oauth.js";
import data from "./unidades_parte2.json" assert { type: "json" };
import "dotenv/config";

async function enviarMasivo() {
    let obj = {};

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (!obj[element.nameType]) {
            obj[element.nameType] = {
                name: element.nameType,
                isInactive: false,
                externalId: element.nameType,
                uom: {
                    items:[]
                }
            };
            let temp = {
                "unitName": element.name,
                "pluralName": element.pluralName,
                "abbreviation": element.abv,
                "pluralAbbreviation": element.pluralAbv,
                "baseUnit": element.unitBase == "T"  ? true : false,
                "conversionRate": Number(element.tasa),
                // "externalId": "UM_99999_UN"
            }

            obj[element.nameType].uom.items.push(temp);
        }else{
            let temp = {
                "unitName": element.name,
                "pluralName": element.pluralName,
                "abbreviation": element.abv,
                "pluralAbbreviation": element.pluralAbv,
                "baseUnit": element.unitBase == "T"  ? true : false,
                "conversionRate": Number(element.tasa),
                // "externalId": "UM_99999_UN"
            }
            obj[element.nameType].uom.items.push(temp);
        }
    }
    // console.log("Unidades agrupadas por tipo:", Object.keys(obj).length);
    // console.log("el primer valor", obj["UM_1002580"])
    // console.log("el primer valor", obj["UM_1002580"].uom)
    // delete obj["UM_1002580"]

    // console.log("Unidades agrupadas por tipo después de eliminar UM_1015423:", Object.keys(obj));
    // console.log("esto es lo que se viene ", obj["UM_1015423"])
    // console.log("OBJ:", obj);
    // let  valores = Object.values(obj);
    let  valores = Object.values(obj);

    // try {
    //     const r = await netsuiteRequest(obj["UM_1013073"]);
    //     console.log("OK:", r.id);
    // } catch (error) {
    //     console.error("Error:", error.message);
    // }

    for (let i = 0; i < valores.length; i++) {
        const unidad = valores[i];

        console.log("Enviando unidad", i + 1);
        console.log("Enviando unidad", unidad);

        try {
            const r = await netsuiteRequest(valores[i]);
            console.log("OK:", r.id);
        } catch (e) {
            console.log("Error en registro", i + 1, e);
        }
    }

    console.log("Proceso terminado", valores.length, "unidades enviadas.");
}

enviarMasivo();
