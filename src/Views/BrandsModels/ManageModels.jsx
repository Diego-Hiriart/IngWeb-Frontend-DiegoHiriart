import {React, useEffect, useState, Fragment } from "react";
import ReadRowModel from './Components/ReadRowBrand';
import EditableRowModel from './Components/EditableRowBrand';
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function ManageModels(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlGetModels = 'https://localhost:7017/api/models/get-all'
    const urlGetBrands = 'https://localhost:7017/api/brands'
    const [models, setModels] = useState(null);//Empty by default
    const [brands, setBrands] = useState(null);//Empty by default, needed for creation and editing
    const [editModelId, setEditModelId] = useState(null);//To check if someting is being edited
    const [modelForm, setModelForm] = useState({
        modelId : '',
        brandId : '',
        modelNumber : '',
        name : '',
        launch : '',
        discontinued : false
    })

    const inputStyle = {'margin':'2px'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px', 'overflow':'auto'};

    //Check if the user is logged in as soon as this page is entered
    useEffect(() => {
        AuthCheck().then((status) => setResponse(status))
    }, [])

    //Check what to do with the response
    useEffect(() => {      
        if(response == 200){
            setIs401(false)
            setIs403(false)
            getModels();//if permissions exist, get all models and brands
            getBrands();
        }else if(response == 401){
            setIs401(true)
            setIs403(true)
        }else if(response == 403){
            setIs401(false)
            setIs403(true)
        }
        console.log(response)
    }, [response])

    //Function to send GET request
    const getModels = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        };
        await fetch(urlGetModels, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setModels(json));
            }else{
                console.log("GET models failed");
            }
        })
    }

    const getBrands = async () =>{
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        };
        await fetch(urlGetBrands, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setBrands(json));
            }else{
                console.log("GET brands failed");
            }
        })
    } 

    const handleFormChange = (event) => {
        var fieldValue;
        if(event.target.type != "checkbox"){
            fieldValue = event.target.value;//Get the value of the field
            event.preventDefault();
        }else{
            fieldValue = event.target.checked;//get if it checked (true or false), value will return "on" or nothing
            //Putting an event.preventDefault(); here makes the checkbox need 2 clicks to change states, dont know why
        }
        
        const fieldName = event.target.getAttribute("name");//Get the name field

        const newFormData = {...modelForm}//Get the current state of newBorrowing
        newFormData[fieldName] = fieldValue//Update the value of a field

        setModelForm(newFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const create = async (model) => {
            const urlPost = 'https://localhost:7017/api/models';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken"))},
                body: JSON.stringify(model)
            };
            console.log(JSON.stringify(model))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Model created successfully")
                        getModels();//Updates table
                    }else{
                        console.log("Creation error");
                    }
                }); 
        }

        const newModel = {
            brandId : modelForm.brandId,
            modelNumber : modelForm.modelNumber,
            name : modelForm.name,
            launch : modelForm.launch,
            discontinued : modelForm.discontinued
        }

        create(newModel);
    }

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const edit = async (model) => {
            const urlPost = 'https://localhost:7017/api/models';
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) },
                body: JSON.stringify(model)
            };
            console.log(JSON.stringify(model))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        getModels();//Updates table
                        setEditModelId(null)//Exits the editing row by changing the state (this causes a reload)
                    }else{
                        console.log("Edit error");
                    }
                }); 
        }

        const editedModel = {
            modelId : editModelId,
            brandId : modelForm.brandId,
            modelNumber : modelForm.modelNumber,
            name : modelForm.name,
            launch : modelForm.launch,
            discontinued : modelForm.discontinued
        }

        edit(editedModel);
    }

    const handleEditClick = (event, model) => {
        event.preventDefault();

        setEditModelId(model.modelId);
        const formValues = {
            modelId : model.modelId,
            brandId : model.brandId,
            modelNumber : model.modelNumber,
            name : model.name,
            launch : model.launch,
            discontinued : model.discontinued
        }

        setModelForm(formValues);
    } 

    const handleCancelClick = () =>{
        setEditModelId(null)//Returns to null, this causes a reload on which the editable row is not rendered
    }

    const handleDeleteClick = async (modelId) => {
        const urlDel = 'https://localhost:7017/api/models/';
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) }
        };
        await fetch(urlDel+modelId, requestOptions)
            .then(res => {
                if(res.ok){
                    getModels();//Reload due to a state change
                }else{
                    console.log("Deletion failed")
                }
            }) 
    }

    let content = 
        <div className="container" style={{margin:'6px'}}>
            <div style={{display: 'flex', flexDirection:"column",  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Manage Models</h1>
                <p>Something went wrong</p>  
            </div>
            <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
            </div>
        </div>
    
    if(is401){
        content =
            <div className="container">
                <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width: '70%'}}>
                    <h3><br/>You must be logged in to view this</h3>
                    <button onClick={() => {navigate("/login")}}>Log in</button>
                </div>
            </div>
    }else {
        if(is403){
            content =
                <div className="container">
                    <div style={{display: 'flex', flexDirection:'column',  justifyContent:'center', alignItems:'center', width: '70%'}}>
                        <h3><br/>You are not allowed to view this</h3>
                        <button onClick={() => {navigate("/brands-models")}}>Return to menu</button>
                    </div>
                </div>
        }else if(!is401 && !is403){
            if(brands){//If brands array has content
                content =
                    <div className="container" style={{margin:'6px'}}>
                        <h1>Manage Models</h1>
                        <div style={{display: 'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', width: '100%'}}>
                            <form onSubmit={handleEditFormSubmit}>
                                <table style={{tableStyle}}>
                                    <thead>
                                        <tr style={tableStyle}>
                                            <th style={tableStyle}>Model ID</th>
                                            <th style={tableStyle}>Brand</th>
                                            <th style={tableStyle}>Model number</th>
                                            <th style={tableStyle}>Name</th>
                                            <th style={tableStyle}>Launch date</th>
                                            <th style={tableStyle}>Discontinued</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {models && brands &&
                                            models.map((model) => (
                                                <Fragment>
                                                    {/*If editModelId equals the id of this row's brand it means the button was clicked and the editable row must be rendered, 
                                                    if it is null it means the user does not want to edit anything, this is seen when the editing is done or canceled*/}
                                                    {editModelId === model.modelId ?  
                                                    <EditableRowModel model={model} brands={brands} handleFormChange={handleFormChange} handleCancelClick={handleCancelClick}/> :
                                                    <ReadRowModel model = {model} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>}  
                                                </Fragment>
                                            ))
                                        }                            
                                    </tbody>
                                </table>
                            </form>
                            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                                <h2>Create a new brand</h2>
                                <form onSubmit={handleAddFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                                    <label>Brand </label>
                                    <select name="brandId" id="brand" defaultValue={"default"} onChange={handleFormChange} style={inputStyle}>
                                        <option value={"default"} disabled>Choose an option</option>
                                        {brands &&
                                            brands.map(
                                                (brand) =>(<option value={brand.brandId}>{brand.name}</option>)
                                            )
                                        }
                                    </select>
                                    <label>Model number </label>
                                    <input type="text" name="modelNumber" required="required" placeholder="model number" onChange={handleFormChange} style={inputStyle}/>
                                    <label>Name </label>
                                    <input type="text" name="name" required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
                                    <label>Launch date </label>
                                    <input type="date" name="launch" required="requiered" placeholder="launch date" onChange={handleFormChange} style={inputStyle}></input>
                                    <label>Discontinued </label>
                                    <input type="checkbox" name="discontinued" onChange={handleFormChange} style={inputStyle}/>
                                    <button type="submit" style={spacedStyle}>Add brand</button>
                                </form>
                            </div>
                        </div>
                    </div>
            }
        }
    }
    
    return(
        <div>
            {content}
        </div>
    )
}

export default ManageModels;