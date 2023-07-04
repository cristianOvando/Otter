import { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import UltimoHistContext from "../contexts/ultimoHistContext";
import Header from "../components/molecules/Header";
import Aside from "../components/molecules/Aside";
import ComboPacientes from "../components/atoms/ComboPacientes";
import LengthContext from "../contexts/lengthContext";
import PacienteContext from "../contexts/pacienteContext";
import TablaEquivalentes from "../components/atoms/TablaEquivalentes";
import TablaKC from "../components/atoms/TablaKC";
import TokenContext from "../contexts/tokenContext";
import MenuContext from "../contexts/menuContext";
import '../assets/styles/Tablas.css';
function Tablas({nutriologo}) {
    const {menu, setMenu} = useContext(MenuContext);
    const {token, setToken} = useContext(TokenContext);
    const [equivalentes, setEquivalentes] = useState({ verduras: 0, frutas: 0, cyt_sg: 0, cyt_cg: 0, leguminosas: 0 , animal_mb: 0, animal_b: 0 , animal_m: 0, animal_a: 0 , leche_d: 0, leche_sd:0, leche_e: 0, leche_ca: 0, aceite_sp: 0 , aceite_cp: 0, azucar_sg: 0, azucar_cg: 0, lde: 0 , alcohol: 0 });
    const [kc, setKC] = useState({ge: 0, hco: 0, lip: 0, prot: 0})
    const {paciente, setPaciente} = useContext(PacienteContext);
    const {length, setLength} = useContext(LengthContext);
    const {ultimoHist, setUltimoHist} = useContext(UltimoHistContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(paciente)
        {
            let options = {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`
                },
              }
            fetch(`https://otter.iothings.com.mx:3000/equivalentes/${paciente._id}`, options)
            .then((response) => response.json())
            .then((data) => {
                if(data.length)
                {
                    setEquivalentes(data[0]);
                    fetch(`https://otter.iothings.com.mx:3000/kcs/${paciente._id}`, options)
                    .then((response) => response.json())
                    .then((data) => {
                    if(data.length)
                    {
                        setKC(data[0]);
                        setLength(data.length);
                    
                    }
                    else
                    {
                        setLength(0);
                    }   
                    });
                    
                }
                else
                {
                    setLength(0);
                }
            });
        }
        else{
            setLength(0);
        }
    },[paciente]);
    const handlerClick =  () => {
        if(paciente)
        {
            let options = {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`
                },
              }
            let uri = `https://otter.iothings.com.mx:3000/ultimohistorial/${paciente._id}`;
            fetch(uri, options)
            .then((response) => response.json())
            .then((data) => {
                if(data.length != 0)
                {
                    setLength(0);
                    setUltimoHist(data[0]);
                    setMenu(false);
                    navigate("/calcularkc");
                }
                else
                {
                    setLength(data.length);
                    alert("Recuerda que es necesario que el paciente tenga al menos un historial para poder calcular las tablas, debido a que se utiliza la información del último historial para poder obtener las tablas actuales.");
                    navigate("/historiales");
                }
            });
            
        }
        else{
            alert("Seleccione un paciente")
        }
    }
    return (  
        <>
        <div className="div-page">
            <Header></Header> 
            <div className="div-page-main">
                <Aside></Aside>
                <div className="div-page-content">
                    <div className="tarjeta1-tablas">
                        <ComboPacientes nutriologo={nutriologo}></ComboPacientes>
                        <button onClick={handlerClick}>Recalcular tablas</button>
                    </div>       
                    <div className="tarjeta2-tablas">
                        {
                            !!length && <p>Tabla de Kilocalorías</p>
                        }
                        
                        {
                            !!length && <TablaKC kc={kc}/>
                        }
                    </div>
                    <div className="tarjeta3-tablas">
                        {
                            !!length && <p>Tabla de Equivalentes</p>
                        }
                        
                        {
                            !!length && <TablaEquivalentes equivalentes={equivalentes} kc={kc}/>
                        }
                    </div>
                </div>
            </div>

        </div>
        
        
        
        </>
    );

}
export default Tablas;