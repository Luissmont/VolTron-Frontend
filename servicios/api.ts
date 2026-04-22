
export interface componente_catalogo {
    id: string;
    name: string;
    category: string;
    logic_level: string;
    voltage_min: number;
    voltage_max: number;
    current_draw_ma: number;
    max_supply_ma: number;
    price_usd: number;
    price_mxn: number;
}

export async function obtener_catalogo() {
    const url_base = process.env.NEXT_PUBLIC_URL_API_BASE || process.env.url_api_base;

    if (!url_base) {
        throw new Error('error critico: url de la api no esta configurada en el entorno');
    }
    const respuesta = await fetch(`${url_base}/components/`, {
        cache: 'no-store'
    });

    if (!respuesta.ok) {
        throw new Error('error de seguridad o red al cargar el catalogo');
    }

    const datos_catalogo = await respuesta.json();
    return datos_catalogo as componente_catalogo[];
}