"use client";

import { useState, useEffect } from "react";
import { obtener_catalogo, componente_catalogo } from "../../servicios/api";
import { crear_proyecto_vacio, vincular_componente_a_proyecto, validar_proyecto } from "../../servicios/proyectos";

interface resultado_validacion_tipo {
    total_draw_ma: number;
    total_supply_ma: number;
    is_overloaded: boolean;
    remaining_ma: number;
    voltage_status: string;
    is_critical_margin: boolean;
    brain_name: string;
}

const obtener_mensaje_humano = (status: string, sobrecarga: boolean) => {
    if (sobrecarga) return "Corriente excedida. Agrega una fuente de poder externa o quita actuadores.";
    if (status === "VOLTAGE_TOO_LOW") return "Incompatibilidad: Tus componentes requieren 5V pero tu cerebro opera a voltaje menor. Los sensores podrian no funcionar.";
    if (status === "VOLTAGE_TOO_HIGH") return "Peligro: Estas enviando senales de voltaje alto a un cerebro de bajo voltaje. Lo vas a quemar.";
    if (status === "OK" && !sobrecarga) return "Circuito estable y seguro para ensamblaje fisico.";
    return "Faltan datos para un diagnostico completo.";
};

export default function MesaEnsamblaje() {
    const [catalogo_disponible, set_catalogo_disponible] = useState<componente_catalogo[]>([]);
    const [piezas_proyecto, set_piezas_proyecto] = useState<componente_catalogo[]>([]);
    const [cargando, set_cargando] = useState(true);
    const [procesando, set_procesando] = useState(false);
    const [resultado_validacion, set_resultado_validacion] = useState<resultado_validacion_tipo | null>(null);
    const [error_sistema, set_error_sistema] = useState<string | null>(null);

    useEffect(() => {
        async function cargar_datos() {
            try {
                const datos = await obtener_catalogo();
                set_catalogo_disponible(datos);
            } catch (error) {
                set_error_sistema("No se pudo conectar con el inventario del servidor.");
            } finally {
                set_cargando(false);
            }
        }
        cargar_datos();
    }, []);

    const agregar_pieza = (pieza_nueva: componente_catalogo) => {
        set_piezas_proyecto([...piezas_proyecto, pieza_nueva]);
        set_error_sistema(null);
        set_resultado_validacion(null);
    };

    const limpiar_proyecto = () => {
        set_piezas_proyecto([]);
        set_error_sistema(null);
        set_resultado_validacion(null);
    };

    const quitar_pieza = (id_eliminar: string) => {
        const indice = piezas_proyecto.findIndex(p => p.id === id_eliminar);
        if (indice !== -1) {
            const nuevas_piezas = [...piezas_proyecto];
            nuevas_piezas.splice(indice, 1);
            set_piezas_proyecto(nuevas_piezas);
            set_error_sistema(null);
            set_resultado_validacion(null);
        }
    };

    const procesar_circuito = async (evento: any) => {
        evento.preventDefault();
        set_error_sistema(null);
        
        if (piezas_proyecto.length === 0) {
            set_error_sistema("El circuito esta vacio. Agrega piezas antes de validar.");
            return;
        }

        let contador_cerebros = 0;
        for (const pieza of piezas_proyecto) {
            if (pieza.category.toUpperCase() === "CEREBRO") {
                contador_cerebros++;
            }
        }

        if (contador_cerebros > 1) {
            set_error_sistema("Error de diseno: Un circuito estandar solo puede tener 1 cerebro principal.");
            return;
        }

        set_procesando(true);

        try {
            const proyecto_nuevo = await crear_proyecto_vacio("proyecto_ensamblaje", "proyecto generado desde la mesa");
            const id_proyecto = proyecto_nuevo.project_id;
            
            if (!id_proyecto) throw new Error("falla de identificacion");

            for (const pieza of piezas_proyecto) {
                await vincular_componente_a_proyecto(id_proyecto, pieza.id);
            }

            const validacion = await validar_proyecto(id_proyecto);
            const datos_reales = Array.isArray(validacion) ? validacion[0] : validacion;

            set_resultado_validacion({
                total_draw_ma: datos_reales.total_consumed_ma || 0,
                total_supply_ma: datos_reales.total_available_ma || 0,
                is_overloaded: datos_reales.is_overloaded || false,
                remaining_ma: datos_reales.remaining_ma || 0,
                voltage_status: datos_reales.voltage_status || "SIN_DATOS",
                is_critical_margin: datos_reales.is_critical_margin || false,
                brain_name: datos_reales.brain_name || "Desconocido"
            });
        } catch (error) {
            set_error_sistema("Ocurrio un error de conexion al validar en el backend.");
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
    let color_diagnostico = "bg-gunmetal";
    let texto_diagnostico = "text-bright-snow";
    
    if (resultado_validacion) {
        if (esta_sobrecargado || resultado_validacion.voltage_status !== "OK") {
            color_diagnostico = "bg-[#721c24]";
            texto_diagnostico = "text-white";
        } else {
            color_diagnostico = "bg-[#0f5132]";
            texto_diagnostico = "text-white";
        }
    }

    const piezas_agrupadas = piezas_proyecto.reduce((acumulador, pieza) => {
        if (!acumulador[pieza.category]) {
            acumulador[pieza.category] = [];
        }
        acumulador[pieza.category].push(pieza);
        return acumulador;
    }, {} as Record<string, componente_catalogo[]>);

    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow p-4 md:p-8 font-sans">
            <div className="w-full max-w-screen-2xl mx-auto">
                <header className="mb-8 border-b border-iron-grey pb-4">
                    <h1 className="text-3xl font-bold text-platinum">Mesa de Ensamblaje</h1>
                    <p className="text-slate-grey mt-1">Construye y valida tu circuito robotico.</p>
                </header>

                {error_sistema && (
                    <div className="w-full bg-[#721c24] text-white p-4 mb-6 border border-red-500 flex justify-between items-center">
                        <p className="font-semibold">{error_sistema}</p>
                        <button onClick={() => set_error_sistema(null)} className="text-xl font-bold hover:text-gray-300">X</button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    <section className="w-full lg:w-1/2 bg-gunmetal border border-iron-grey p-6 rounded-sm">
                        <h2 className="text-xl font-bold text-platinum mb-6">Inventario Disponible</h2>
                        {cargando ? (
                            <p className="text-pale-slate-dark">Cargando piezas</p>
                        ) : (
                            <div className="flex flex-col space-y-3 max-h-[800px] overflow-y-auto pr-2">
                                {catalogo_disponible.map((pieza) => (
                                    <div key={pieza.id} className="flex justify-between items-center bg-shadow-grey border border-iron-grey p-3">
                                        <div>
                                            <p className="font-semibold text-bright-snow">{pieza.name}</p>
                                            <p className="text-xs text-pale-slate-dark uppercase tracking-wide">{pieza.category}</p>
                                        </div>
                                        <button
                                            type="button"
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-platinum">Proyecto Actual</h2>
                            <button onClick={limpiar_proyecto} className="text-xs text-slate-grey hover:text-white uppercase tracking-widest font-bold border border-slate-grey px-2 py-1">
                                Limpiar Mesa
                            </button>
                        </div>

                        <div className="flex-grow bg-shadow-grey border border-iron-grey p-4 mb-6 min-h-[300px] overflow-y-auto">
                            {piezas_proyecto.length === 0 ? (
                                <p className="text-slate-grey text-center mt-10">No hay piezas en el proyecto.</p>
                            ) : (
                                <div className="space-y-4">
                                    {Object.keys(piezas_agrupadas).map((categoria) => (
                                        <div key={categoria} className="mb-4">
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-slate-grey border-b border-iron-grey pb-1 mb-2">
                                                {categoria} ({piezas_agrupadas[categoria].length})
                                            </h4>
                                            <ul className="space-y-1 pl-2 border-l-2 border-iron-grey">
                                                {piezas_agrupadas[categoria].map((pieza, indice) => (
                                                    <li key={indice} className="text-pale-slate-light text-sm flex justify-between py-1 items-center">
                                                        <span>{pieza.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-slate-grey text-xs">
                                                                {pieza.current_draw_ma > 0 ? `${pieza.current_draw_ma} mA` : 'Base'}
                                                            </span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => quitar_pieza(pieza.id)}
                                                                className="text-slate-grey hover:text-[#721c24] font-bold text-xs"
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-shadow-grey border border-iron-grey p-4">
                            <h3 className="text-sm uppercase tracking-widest text-slate-grey font-bold mb-3 border-b border-iron-grey pb-2">Diagnostico del Sistema</h3>
                            
                            {resultado_validacion && (
                                <>
                                    <div className="mb-4 space-y-2 text-sm text-pale-slate-dark bg-gunmetal p-3 border border-iron-grey">
                                        <p className="flex justify-between">
                                            <span className="font-semibold text-slate-grey uppercase tracking-wider text-xs">Cerebro Principal:</span> 
                                            <span className="text-bright-snow font-medium">{resultado_validacion.brain_name}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-semibold text-slate-grey uppercase tracking-wider text-xs">Corriente Restante:</span> 
                                            <span className="text-platinum">{resultado_validacion.remaining_ma} mA</span>
                                        </p>
                                    </div>

                                    <div className={`p-4 mb-4 border ${color_diagnostico}`}>
                                        <p className={`font-semibold text-sm ${texto_diagnostico}`}>
                                            {obtener_mensaje_humano(resultado_validacion.voltage_status, esta_sobrecargado)}
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="w-full bg-gunmetal h-4 mb-2 border border-iron-grey">
                                <div 
                                    className={`h-full ${
                                        esta_sobrecargado ? 'bg-[#721c24]' : 
                                        (resultado_validacion?.is_critical_margin ? 'bg-yellow-600' : 'bg-platinum')
                                    }`} 
                                    style={{ width: `${ancho_barra}%` }}
                                ></div>
                            </div>
                            
                            <p className="text-xs text-pale-slate-dark text-right mt-2">{consumo} mA / {suministro} mA Suministrados</p>

                            <button 
                                type="button"
                                onClick={procesar_circuito}
                                disabled={procesando || piezas_proyecto.length === 0}
                                className="w-full mt-4 bg-iron-grey hover:bg-slate-grey disabled:opacity-50 disabled:cursor-not-allowed text-bright-snow font-bold py-3 transition-colors"
                            >
                                {procesando ? 'Validando Base de Datos...' : 'Validar Circuito'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}