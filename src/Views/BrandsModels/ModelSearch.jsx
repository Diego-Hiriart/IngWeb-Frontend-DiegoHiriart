import {React, useEffect, useState, createRef } from "react";
import { format, parseISO } from 'date-fns';

function ModelSearch(){
    const [brands, setBrands] = useState(null);
    const [models, setModels] = useState(null);
    const [modelInfo, setModelInfo] = useState(null);
    const [modelStats, setModelStats] = useState(null);
    const urlGetBrands = 'https://localhost:7017/api/brands'
    const urlGetBrandModels = 'https://localhost:7017/api/models/by-brand/'
    const urlSearchModel = 'https://localhost:7017/api/models/search/'
    const urlModelStats = 'https://localhost:7017/api/stats/by-model/'
    const selectedModelRef = createRef();

    //Function to send GET request
    const getBrands = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(urlGetBrands, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setBrands(json));
            }
        })
    }

    const getBrandModels = async (evt) =>{
        const selectedBrand = evt.target.value;
        setModels(null);//Reset to rerender
        setModelInfo(null);
        setModelStats(null);
        selectedModelRef.current.value = "default";
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        };
        await fetch(urlGetBrandModels+selectedBrand, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setModels(json));
            }
        })
    }

    const searchModel = async (evt) => {
        const selectedModel = evt.target.value;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(urlSearchModel+selectedModel, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setModelInfo(json));
            }
        })
    }

    const getModelStats = async (evt) =>{
        const selectedModel = evt.target.value;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch(urlModelStats+selectedModel, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setModelStats(json));
            }
        })
    }

    const durationString = (days) =>{
        var years = Math.floor(days/365);
        var months = Math.floor((days % 365) / 30);
        var days = Math.floor((days % 365) % 30);

        return years + " year(s) " + months + " month(s) " + days + " day(s) ";
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
                <select name="models" id="model" defaultValue={"default"} ref={selectedModelRef} onChange={event => { searchModel(event); getModelStats(event)}} style={inputStyle}>
                    <option value={"default"} disabled>Choose an option</option>
                    {models &&
                        models.map(
                            (model) => (<option value={model.modelId}>{model.name} ({model.modelNumber})</option>)
                        )
                    }
                </select>
                {modelStats &&
                    <>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableStyle}>
                                <th style={tableStyle}>ID</th>
                                <th style={tableStyle}>Model number</th>
                                <th style={tableStyle}>Name</th>
                                <th style={tableStyle}>Launch date</th>
                                <th style={tableStyle}>Discontinued</th>
                            </tr>
                        </thead>
                        {modelInfo &&
                            <tbody>
                                <td style={tableStyle}>{modelInfo[0].modelId}</td>                       
                                <td style={tableStyle}>{modelInfo[0].modelNumber}</td>
                                <td style={tableStyle}>{modelInfo[0].name}</td>
                                <td style={tableStyle}>{format(new Date(modelInfo[0].launch), "yyy-MM-dd")}</td>
                                <td style={{tableStyle, textAlign:"center"}}><input type="checkbox" checked={modelInfo[0].discontinued} disabled={true}/></td>
                            </tbody>                       
                        }
                    </table>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableStyle}>
                                <th style={tableStyle}>Reviews</th>
                                <th style={tableStyle}>Life span (years)</th>
                                <th style={tableStyle}>Time without issues (years)</th>
                            </tr>
                        </thead>
                        {modelStats && modelStats.totalReviews > 0 ?
                            <tbody>
                                <td style={tableStyle}>{modelStats.totalReviews}</td>
                                <td style={tableStyle}>{durationString(modelStats.lifeSpan)}</td>
                                <td style={tableStyle}>{durationString(modelStats.issueFree)}</td>
                            </tbody>
                            :
                            <tbody>
                                <td style={tableStyle} colSpan="3">No reviews have been made for this model yet</td>
                            </tbody>
                        }
                    </table>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableStyle}>
                                <th style={tableStyle}>Component</th>
                                <th style={tableStyle}>Percentage of reviews with issues</th>
                                <th style={tableStyle}>Perecentage of issues fixable</th>
                            </tr>
                        </thead>
                        {modelStats && modelStats.componentIssues.length > 0?//Show only if theres something to show
                            modelStats.componentIssues.map(compIssues =>
                                <tbody>
                                    <td style={tableStyle}>{compIssues.component.name}</td>
                                    <td style={tableStyle}>{compIssues.percentIssues*100}%</td>
                                    <td style={tableStyle}>{compIssues.percentFixable*100}%</td>
                                </tbody>
                            )
                            :
                            <tbody>
                                <td style={tableStyle} colSpan="3">No reviews have been made for this model yet</td>
                            </tbody>
                        }
                    </table>
                    </>
                }
            </div>
        </div>

    return(
        <div>
            {content}
        </div>
    )
}

export default ModelSearch