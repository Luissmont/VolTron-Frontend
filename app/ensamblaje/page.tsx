"use client";

import { useState, useEffect } from "react";
import { obtener_catalogo, componente_catalogo } from "../../servicios/api";
import { crear_proyecto_vacio, vincular_componente_a_proyecto, validar_proyecto } from "../../servicios/proyectos";

interface resultado_validacion_tipo {
    total_draw_ma: number;
    total_supply_ma: number;
    is_overloaded: boolean;
}

export default function MesaEnsamblaje() {
    const [catalogo_disponible, set_catalogo_disponible] = useState<componente_catalogo[]>([]);
    const [piezas_proyecto, set_piezas_proyecto] = useState<componente_catalogo[]>([]);
    const [cargando, set_cargando] = useState(true);
    const [procesando, set_procesando] = useState(false);
    const [resultado_validacion, set_resultado_validacion] = useState<resultado_validacion_tipo | null>(null);

    useEffect(() => {
        async function cargar_datos() {
            try {
                const datos = await obtener_catalogo();
                set_catalogo_disponible(datos);
            } catch (error) {
                
            } finally {
                set_cargando(false);
            }
        }
        cargar_datos();
    }, []);

    const agregar_pieza = (pieza_nueva: componente_catalogo) => {
        set_piezas_proyecto([...piezas_proyecto, pieza_nueva]);
    };

    const procesar_circuito = async () => {
        if (piezas_proyecto.length === 0) return;
        set_procesando(true);

        try {
            const proyecto_nuevo = await crear_proyecto_vacio("proyecto_ensamblaje", "proyecto generado desde la mesa");
            console.log("payload_del_backend:", proyecto_nuevo);
            const id_proyecto = proyecto_nuevo.id || proyecto_nuevo.project_id;
            
            if (!id_proyecto) throw new Error("no se pudo extraer el id del proyecto");

            for (const pieza of piezas_proyecto) {
                await vincular_componente_a_proyecto(id_proyecto, pieza.id);
            }

            const validacion = await validar_proyecto(id_proyecto);
            set_resultado_validacion({
                total_draw_ma: validacion.total_draw_ma,
                total_supply_ma: validacion.total_supply_ma,
                is_overloaded: validacion.is_overloaded
            });
        } catch (error) {
            console.error("error en procesamiento:", error);
            alert("Ocurrio un error, revisa la consola");
        } finally {
            set_procesando(false);
        }
    };

    const consumo = resultado_validacion ? resultado_validacion.total_draw_ma : 0;
    const suministro = resultado_validacion ? resultado_validacion.total_supply_ma : 0;
    let ancho_barra = 0;
    
    if (suministro > 0) {
        ancho_barra = (consumo / suministro) * 100;
        if (ancho_barra > 100) ancho_barra = 100;
    }

    const esta_sobrecargado = resultado_validacion ? resultado_validacion.is_overloaded : false;

    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow p-4 md:p-8 font-sans">
            <div className="w-full max-w-screen-2xl mx-auto">
                <header className="mb-8 border-b border-iron-grey pb-4">
                    <h1 className="text-3xl font-bold text-platinum">Mesa de Ensamblaje</h1>
                    <p className="text-slate-grey mt-1">Construye y valida tu circuito robotico.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <section className="w-full lg:w-1/2 bg-gunmetal border border-iron-grey p-6 rounded-sm">
                        <h2 className="text-xl font-bold text-platinum mb-6">Inventario Disponible</h2>

                        {cargando ? (
                            <p className="text-pale-slate-dark">Cargando piezas</p>
                        ) : (
                            <div className="flex flex-col space-y-3">
                                {catalogo_disponible.map((pieza) => (
                                    <div key={pieza.id} className="flex justify-between items-center bg-shadow-grey border border-iron-grey p-3">
                                        <div>
                                            <p className="font-semibold text-bright-snow">{pieza.name}</p>
                                            <p className="text-xs text-pale-slate-dark uppercase tracking-wide">{pieza.category}</p>
                                        </div>
                                        <button
                                            onClick={() => agregar_pieza(pieza)}
                                            className="bg-iron-grey hover:bg-slate-grey text-white text-sm font-bold py-1 px-4 transition-colors"
                                        >
                                            + Agregar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="w-full lg:w-1/2 bg-gunmetal border border-iron-grey p-6 rounded-sm flex flex-col">
                        <h2 className="text-xl font-bold text-platinum mb-6">Proyecto Actual</h2>

                        <div className="flex-grow bg-shadow-grey border border-iron-grey p-4 mb-6 min-h-[300px] overflow-y-auto">
                            {piezas_proyecto.length === 0 ? (
                                <p className="text-slate-grey text-center mt-10">No hay piezas en el proyecto.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {piezas_proyecto.map((pieza, indice) => (
                                        <li key={indice} className="text-pale-slate-light text-sm flex justify-between border-b border-iron-grey pb-1">
                                            <span>{pieza.name}</span>
                                            <span className="text-slate-grey">{pieza.current_draw_ma > 0 ? `${pieza.current_draw_ma} mA` : 'Cerebro'}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-shadow-grey border border-iron-grey p-4">
                            <h3 className="text-sm uppercase tracking-widest text-slate-grey font-bold mb-3">Estado Electrico</h3>
                            <div className="w-full bg-gunmetal h-4 mb-2 border border-iron-grey">
                                <div className={`h-full ${esta_sobrecargado ? 'bg-[#721c24]' : 'bg-platinum'}`} style={{ width: `${ancho_barra}%` }}></div>
                            </div>
                            
                            {esta_sobrecargado && (
                                <p className="text-[#721c24] font-bold text-xs uppercase tracking-widest mt-2 mb-2">
                                    SOBRECARGA DETECTADA
                                </p>
                            )}
                            
                            <p className="text-xs text-pale-slate-dark text-right">{consumo} mA / {suministro} mA Suministrados</p>

                            <button 
                                onClick={procesar_circuito}
                                disabled={procesando || piezas_proyecto.length === 0}
                                className="w-full mt-4 bg-iron-grey hover:bg-slate-grey disabled:opacity-50 disabled:cursor-not-allowed text-bright-snow font-bold py-3 transition-colors"
                            >
                                {procesando ? 'Procesando' : 'Validar Circuito en Backend'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}