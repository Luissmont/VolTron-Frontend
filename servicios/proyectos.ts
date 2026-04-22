export async function crear_proyecto_vacio(nombre: string, descripcion: string) {
    const url_base = process.env.url_api_base;
    
    if (!url_base) {
        throw new Error("error critico: url de la api no definida");
    }
    
    const respuesta = await fetch(`${url_base}/projects/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nombre,
            description: descripcion
        })
    });
    
    if (!respuesta.ok) {
        throw new Error("falla de red o error del servidor al intentar guardar el proyecto");
    }
    
    const datos_proyecto = await respuesta.json();
    return datos_proyecto;
}

export async function vincular_componente_a_proyecto(id_proyecto: string, id_componente: string) {
    const url_base = process.env.url_api_base;
    
    if (!url_base) {
        throw new Error("error critico: url de la api no definida");
    }
    
    const respuesta = await fetch(`${url_base}/projects/${id_proyecto}/components/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            component_id: id_componente
        })
    });
    
    if (!respuesta.ok) {
        throw new Error("falla de red o error del servidor al intentar agregar la pieza al proyecto");
    }
    
    const datos_vinculacion = await respuesta.json();
    return datos_vinculacion;
}
