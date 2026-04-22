export default function CargandoTaller() {
    return (
        <main className="min-h-screen bg-shadow-grey text-bright-snow p-4 md:p-8 font-sans">
            <div className="w-full max-w-screen-2xl mx-auto">

                <header className="mb-10 pb-4 border-b border-iron-grey">
                    <div className="h-10 w-64 bg-gunmetal rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gunmetal rounded animate-pulse"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="flex flex-row bg-gunmetal border border-iron-grey/60 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                            <div className="w-1/3 bg-shadow-grey/60 p-4 flex flex-col justify-center items-center border-r border-iron-grey/40">
                                <div className="h-3 w-10 bg-iron-grey rounded mb-3"></div>
                                <div className="h-8 w-16 bg-iron-grey rounded mb-2"></div>
                                <div className="h-3 w-12 bg-iron-grey/50 rounded"></div>
                            </div>
                            <div className="w-2/3 p-5 flex flex-col justify-center gap-3">
                                <div className="h-5 w-3/4 bg-iron-grey rounded"></div>
                                <div className="h-3 w-1/2 bg-iron-grey/50 rounded"></div>
                                <div className="h-3 w-2/3 bg-iron-grey/50 rounded"></div>
                                <div className="h-3 w-1/2 bg-iron-grey/50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
