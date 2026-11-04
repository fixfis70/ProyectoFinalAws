import './App.css'
import ComprobanteForm from "./componentes/ComprobanteForm.tsx";
import ComprobantesGrid from "./componentes/ComprobanteGrid.tsx";

function App() {

    return (
        <>
            <ComprobanteForm onSubmit={
                (data) => console.log(data)
            }/>
            <ComprobantesGrid/>
        </>
    )
}

export default App
