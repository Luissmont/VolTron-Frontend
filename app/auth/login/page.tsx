"use client";

import { useState } from "react";
import { iniciar_sesion } from "../../../servicios/auth";

export default function Login() {
    const [correo, set_correo] = useState("");
    const [contrasena, set_contrasena] = useState("");
    const [cargando, set_cargando] = useState(false);
    const [error, set_error] = useState<string | null>(null);

    const procesar_login = async (evento: any) => {
        evento.preventDefault();
        set_cargando(true);
        set_error(null);

        try {
            const respuesta = await iniciar_sesion(correo, contrasena);
            localStorage.setItem("token_voltron", respuesta.access_token);
            window.location.href = "/";
        } catch (falla: any) {
            set_error("Credenciales incorrectas o fallo de red.");
        } finally {
            set_cargando(false);
        }
    };

    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow flex items-center justify-center p-4">
            <div className="bg-gunmetal/90 backdrop-blur-md border border-iron-grey/50 p-8 w-full max-w-md rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold text-platinum mb-6 text-center">Acceso de Sistema</h1>

                {error && (
                    <div className="bg-[#721c24] text-white p-3 mb-6 font-semibold text-center border border-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={procesar_login} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-grey uppercase tracking-widest mb-2">
                            Correo Electronico
                        </label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(evento) => set_correo(evento.target.value)}
                            required
                            className="w-full bg-shadow-grey/60 border border-iron-grey/60 text-bright-snow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-grey transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-grey uppercase tracking-widest mb-2">
                            Contrasena
                        </label>
                        <input
                            type="password"
                            value={contrasena}
                            onChange={(evento) => set_contrasena(evento.target.value)}
                            required
                            className="w-full bg-shadow-grey/60 border border-iron-grey/60 text-bright-snow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-grey transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="w-full bg-iron-grey hover:bg-slate-grey text-bright-snow font-bold py-3 mt-4 disabled:opacity-40 transition-all duration-200 rounded-xl cursor-pointer uppercase tracking-widest"
                    >
                        {cargando ? "Iniciando proceso..." : "Entrar al Sistema"}
                    </button>

                    <p className="text-center text-sm text-pale-slate-dark mt-4">
                        Requiere autorizacion externa. <a href="/auth/registro" className="text-platinum hover:underline">Acceso a Registro</a>
                    </p>
                </form>
            </div>
        </main>
    );
}
