import { netsuiteRequest } from "./oauth.js";
import data from "./unidades_parte3.json" assert { type: "json" };
import "dotenv/config";

async function enviarMasivo() {
    let obj = {};
    let errores = [];

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (!obj[element.nameType]) {
            obj[element.nameType] = {
                name: element.nameType,
                isInactive: false,
                externalId: element.nameType,
                uom: {
                    items: []
                }
            };
        }

        let temp = {
            unitName: element.name,
            pluralName: element.pluralName,
            abbreviation: element.abv,
            pluralAbbreviation: element.pluralAbv,
            baseUnit: element.unitBase == "T",
            conversionRate: Number(element.tasa),
            // externalId: element.externalid
        };

        obj[element.nameType].uom.items.push(temp);
    }

    let valores = Object.values(obj);

    // for (let i = 0; i < valores.length; i++) {
    //     const unidad = valores[i];

    //     console.log("Enviando unidad", i + 1);
    //     console.log("Enviando unidad", unidad);

    //     try {
    //         const r = await netsuiteRequest(unidad);

    //         console.log("OK:", r.id);

    //     } catch (e) {
    //         console.log("Error en registro", i + 1, e);

    //         errores.push({
    //             indice: i + 1,
    //             nameType: unidad.name,
    //             externalId: unidad.externalId,
    //             error: e?.message || String(e),
    //             detalle: e
    //         });
    //     }
    // }

    console.log("=================================");
    console.log("Unidades enviadas:", valores.length);
    console.log("Errores:", errores.length);
    console.log("=================================");

    if (errores.length > 0) {
        console.log("Hubo errores?");
        console.log(JSON.stringify(errores, null, 2));
    } else {
        console.log("Todo Ok");
    }
}

enviarMasivo();