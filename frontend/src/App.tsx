import ComprobanteForm from "./componentes/ComprobanteForm.tsx";
import ComprobantesGrid from "./componentes/ComprobanteGrid.tsx";

function App() {

    return (
        <div className="flex flex-col justify-center bg-red-50">
            <ComprobanteForm
                onSubmit={(data) => console.log(data)}
            />
            <ComprobantesGrid/>
        </div>

    )
}

export default App
