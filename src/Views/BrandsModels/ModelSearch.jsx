import {React, useEffect, useState } from "react";

function ModelSearch(){
    const [brands, setBrands] = useState(null);
    const [models, setModels] = useState(null);
    const urlGetBrands = 'https://localhost:7017/api/brands'
    const urlGetModels = 'https://localhost:7017/api/models/by-brand/'
    const [successGet, setSuccessGet] = useState(null);

    //Function to send GET request
    const getBrands = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
        };
        await fetch(urlGetBrands, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setBrands(json));
                setSuccessGet(true);
            }else if(res.status === 400){
                setSuccessGet(false);
            }
        })
    }

    const getBrandModels = async () =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
        };
        await fetch(urlGetModels, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setModels(json));
                setSuccessGet(true);
            }else if(res.status === 400){
                setSuccessGet(false);
            }
        })
    }

    const searchModel = async () => {

    }

    //Request only runs when url changes
    useEffect(() => {
        getBrands();
    }, [urlGetBrands])   

    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    const inputStyle = {'gap':'2px'};

    let content = 
        <div className="container">
            <div style={{display: 'flex',  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Search models</h1>
            </div>
            <div style={{display: 'flex', flexDirection:"column",  justifyContent:'space-evenly', alignItems:'center', width:"70%", height: '70%', gap:"10px"}}>
                <select name="brands" id="brand" defaultValue={"default"} onChange={getBrandModels} style={inputStyle}>
                    <option value={"default"} disabled>Choose an option</option>
                    {brands &&
                        brands.map(
                            (brand) =>(<option value={brand.brandId}>{brand.name}</option>)
                        )
                    }
                </select>
                <select name="models" id="model" onChange={searchModel} style={inputStyle}>
                    {models &&
                        models.map(
                            (model) => (<option value={model.modelId}>{model.name} ({model.modelNumber})</option>)
                        )
                    }
                </select>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableStyle}>
                            <th style={tableStyle}>ID</th>
                            <th style={tableStyle}>Brand</th>
                            <th style={tableStyle}>Model number</th>
                            <th style={tableStyle}>Name</th>
                            <th style={tableStyle}>Launch date</th>
                            <th style={tableStyle}>Discontinued</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models &&
                            models.map(
                                (model) => 
                                (<td style={tableStyle}></td>
                                )
                            )                            
                        }
                    </tbody>
                </table>
            </div>
        </div>

    return(
        <div>
            {content}
        </div>
    )
}

export default ModelSearch