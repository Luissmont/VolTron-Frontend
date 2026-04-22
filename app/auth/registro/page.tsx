"use client";

import { useState } from "react";
import { registrar_usuario } from "../../../servicios/auth";

export default function Registro() {
    const [nombre, set_nombre] = useState("");
    const [correo, set_correo] = useState("");
    const [contrasena, set_contrasena] = useState("");
    const [cargando, set_cargando] = useState(false);
    const [error, set_error] = useState<string | null>(null);

    const procesar_registro = async (evento: any) => {
        evento.preventDefault();
        set_cargando(true);
        set_error(null);

        try {
            await registrar_usuario(nombre, correo, contrasena);
            window.location.href = "/auth/login";
        } catch (falla: any) {
            set_error("No se pudo crear la cuenta temporal, revisa la red de transmision.");
        } finally {
            set_cargando(false);
        }
    };

    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow flex items-center justify-center p-4">
            <div className="bg-gunmetal border border-iron-grey p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-platinum mb-6 text-center">Registro de Nuevo Ingeniero</h1>
                
                {error && (
                    <div className="bg-[#721c24] text-white p-3 mb-6 font-semibold text-center border border-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={procesar_registro} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-grey uppercase tracking-widest mb-2">
                            Nombre Designado
                        </label>
                        <input 
                            type="text"
                            value={nombre}
                            onChange={(evento) => set_nombre(evento.target.value)}
                            required
                            className="w-full bg-shadow-grey border border-iron-grey text-bright-snow p-3 focus:outline-none focus:border-platinum transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-grey uppercase tracking-widest mb-2">
                            Correo Electronico
                        </label>
                        <input 
                            type="email"
                            value={correo}
                            onChange={(evento) => set_correo(evento.target.value)}
                            required
                            className="w-full bg-shadow-grey border border-iron-grey text-bright-snow p-3 focus:outline-none focus:border-platinum transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-grey uppercase tracking-widest mb-2">
                            Contrasena de Acceso
                        </label>
                        <input 
                            type="password"
                            value={contrasena}
                            onChange={(evento) => set_contrasena(evento.target.value)}
                            required
                            className="w-full bg-shadow-grey border border-iron-grey text-bright-snow p-3 focus:outline-none focus:border-platinum transition-colors"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-iron-grey hover:bg-slate-grey text-bright-snow font-bold py-3 mt-4 disabled:opacity-50 transition-colors uppercase tracking-widest"
                    >
                        {cargando ? "Registrando protocolos..." : "Crear Identidad"}
                    </button>
                    
                    <p className="text-center text-sm text-pale-slate-dark mt-4">
                        ¿Ya posees autorizacion? <a href="/auth/login" className="text-platinum hover:underline">Ir a la consola de ingreso</a>
                    </p>
                </form>
            </div>
        </main>
    );
}
