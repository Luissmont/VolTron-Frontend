
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

    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow p-4 md:p-8 font-sans">
            <div className="w-full max-w-screen-2xl mx-auto">
                <header className="mb-8 border-b border-iron-grey pb-4">
                    <h1 className="text-3xl font-bold text-platinum">Mesa de Ensamblaje</h1>
                    <p className="text-slate-grey mt-1">Construye y valida tu circuito robótico.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">

                    <section className="w-full lg:w-1/2 bg-gunmetal border border-iron-grey p-6 rounded-sm">
                        <h2 className="text-xl font-bold text-platinum mb-6">Inventario Disponible</h2>

                        {cargando ? (
                            <p className="text-pale-slate-dark">Cargando piezas...</p>
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
                            <h3 className="text-sm uppercase tracking-widest text-slate-grey font-bold mb-3">Estado Eléctrico</h3>
                            <div className="w-full bg-gunmetal h-4 mb-2 border border-iron-grey">
                                <div className="bg-platinum h-full" style={{ width: '0%' }}></div>
                            </div>
                            <p className="text-xs text-pale-slate-dark text-right">0 mA / 0 mA Suministrados</p>

                            <button className="w-full mt-4 bg-iron-grey hover:bg-slate-grey text-bright-snow font-bold py-3 transition-colors">
                                Validar Circuito en Backend
                            </button>
                        </div>

                    </section>
                </div>
            </div>
        </main>
    );
}