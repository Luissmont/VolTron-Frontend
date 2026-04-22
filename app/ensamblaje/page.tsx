
"use client";

import { useState, useEffect } from "react";
import { obtener_catalogo, componente_catalogo } from "../../servicios/api";

export default function MesaEnsamblaje() {
    const [catalogo_disponible, set_catalogo_disponible] = useState<componente_catalogo[]>([]);
    const [piezas_proyecto, set_piezas_proyecto] = useState<componente_catalogo[]>([]);
    const [cargando, set_cargando] = useState(true);

    useEffect(() => {
        async function cargar_datos() {
            try {
                const datos = await obtener_catalogo();
                set_catalogo_disponible(datos);
            } catch (error) {
                console.error("Error al cargar piezas:", error);
            } finally {
                set_cargando(false);
            }
        }
        cargar_datos();
    }, []);

    const agregar_pieza = (pieza_nueva: componente_catalogo) => {
        set_piezas_proyecto([...piezas_proyecto, pieza_nueva]);
    };
