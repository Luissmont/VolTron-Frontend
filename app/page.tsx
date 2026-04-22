import { obtener_catalogo } from '../servicios/api';

export default async function VistaCatalogo() {
  const lista_componentes = await obtener_catalogo();

  return (
    <main className="min-h-screen bg-shadow-grey text-bright-snow p-4 md:p-8 font-sans">
      <div className="w-full max-w-screen-2xl mx-auto">

        <header className="mb-10 pb-4">
          <h1 className="text-4xl font-bold text-platinum">
            Componentes
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {lista_componentes.map((componente_actual) => (
            <article
              key={componente_actual.id}
              className="flex flex-row bg-gunmetal border border-iron-grey overflow-hidden"
            >

              <div className="w-1/3 bg-shadow-grey p-4 flex flex-col justify-center items-center border-r-2 border-solid border-iron-grey">
                <span className="block text-xs text-pale-slate-dark font-semibold mb-2 text-center uppercase tracking-widest">
                  Costo
                </span>
                <p className="text-2xl font-bold text-bright-snow text-center">
                  ${componente_actual.price_mxn}
                  <span className="block text-xs font-normal text-alabaster-grey mt-1">MXN</span>
                </p>
                <p className="text-xs text-slate-grey font-medium mt-3">
                  ${componente_actual.price_usd} USD
                </p>
              </div>

              <div className="w-2/3 p-5 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-bright-snow mb-4 truncate">
                  {componente_actual.name}
                </h2>

                <div className="flex flex-col space-y-3 text-sm text-pale-slate-dark">
                  <div className="flex justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-grey font-semibold">Categoría</span>
                    <span className="font-medium text-platinum">{componente_actual.category}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-grey font-semibold">Nivel Lógico</span>
                    <span className="font-medium text-platinum">{componente_actual.logic_level}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-grey font-semibold">mA Máximos</span>
                    <span className="font-medium text-platinum">
                      {componente_actual.current_draw_ma > 0
                        ? componente_actual.current_draw_ma
                        : componente_actual.max_supply_ma} mA
                    </span>
                  </div>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </main>
  );
}