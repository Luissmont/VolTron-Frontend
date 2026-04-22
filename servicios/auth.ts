export async function iniciar_sesion(correo: string, contrasena: string) {
    const url_base = process.env.NEXT_PUBLIC_URL_API_BASE;
    
    if (!url_base) {
        throw new Error("error critico: url de la api no esta configurada");
    }
    
    const parametros = new URLSearchParams();
    parametros.append("username", correo);
    parametros.append("password", contrasena);

    const respuesta = await fetch(`${url_base}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: parametros.toString()
    });
    
    if (!respuesta.ok) {
        throw new Error("credenciales incorrectas o falla en el servidor");
    }
    
    const datos_sesion = await respuesta.json();
    return datos_sesion;
}

export async function registrar_usuario(nombre: string, correo: string, contrasena: string) {
    const url_base = process.env.NEXT_PUBLIC_URL_API_BASE;
    
    if (!url_base) {
        throw new Error("error critico: url de la api no esta configurada");
    }
    
    const respuesta = await fetch(`${url_base}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: nombre,
            email: correo,
            password: contrasena
        })
    });
    
    if (!respuesta.ok) {
        throw new Error("falla al intentar crear la cuenta");
    }
    
    const datos_registro = await respuesta.json();
    return datos_registro;
}
