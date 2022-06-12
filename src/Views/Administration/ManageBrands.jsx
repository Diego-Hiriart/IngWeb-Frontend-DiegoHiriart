import {React, useEffect, useState, Fragment } from "react";
import ReadRowBrand from './Components/ReadRowBrand';
import EditableRowBrand from './Components/EditableRowBrand';
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function ManageBrands(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlGetBrands = 'https://ingweb-back-hiriart.herokuapp.com/api/brands'
    const [brands, setBrands] = useState(null);//Empty by default
    const [editBrandId, setEditBrandId] = useState(null);//To check if someting is being edited
    const [brandForm, setBrandForm] = useState({
        brandId : '',
        name : '',
        isDefunct : false
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
            getAll();//if permissions exist, get all brands
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
    const getAll = async () => {
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

        const newFormData = {...brandForm}//Get the current state of newBorrowing
        newFormData[fieldName] = fieldValue//Update the value of a field

        setBrandForm(newFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const create = async (brand) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/brands';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
                body: JSON.stringify(brand)
            };
            console.log(JSON.stringify(brand))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Brand created successfully")
                        getAll();//Updates table
                    }else{
                        console.log("Creation error");
                    }
                }); 
        }

        const newBrand = {
            name : brandForm.name,
            isDefunct : brandForm.isDefunct
        }

        create(newBrand);
    }

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const edit = async (brand) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/brands';
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
                body: JSON.stringify(brand)
            };
            console.log(JSON.stringify(brand))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        getAll();//Updates table
                        setEditBrandId(null)//Exits the editing row by changing the state (this causes a reload)
                    }else{
                        console.log("Edit error");
                    }
                }); 
        }

        const editedBrand = {
            brandId : editBrandId,
            name : brandForm.name,
            isDefunct : brandForm.isDefunct
        }

        edit(editedBrand);
    }

    const handleEditClick = (event, brand) => {
        event.preventDefault();

        setEditBrandId(brand.brandId);
        const formValues = {
            brandId : brand.brandId,
            name : brand.name,
            isDefunct : brand.isDefunct
        }

        setBrandForm(formValues);
    } 

    const handleCancelClick = () =>{
        setEditBrandId(null)//Returns to null, this causes a reload on which the editable row is not rendered
    }

    const handleDeleteClick = async (brandId) => {
        const urlDel = 'https://ingweb-back-hiriart.herokuapp.com/api/brands/';
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlDel+brandId, requestOptions)
            .then(res => {
                if(res.ok){
                    getAll();//Reload due to a state change
                }else{
                    console.log("Deletion failed")
                }
            }) 
    }

    let content = 
        <div className="container" style={{margin:'6px'}}>
            <div style={{display: 'flex', flexDirection:"column",  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Manage Brands</h1>
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
                        <h1>Manage Brands</h1>
                        <div style={{display: 'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', width: '100%'}}>
                            <form onSubmit={handleEditFormSubmit}>
                                <table style={{tableStyle}}>
                                    <thead>
                                        <tr style={tableStyle}>
                                            <th style={tableStyle}>Brand ID</th>
                                            <th style={tableStyle}>Name</th>
                                            <th style={tableStyle}>Is defunct</th>
                                            <th style={tableStyle}>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brands &&
                                            brands.map((brand) => (
                                                <Fragment>
                                                    {/*If editBrandId equals the id of this row's brand it means the button was clicked and the editable row must be rendered, 
                                                    if it is null it means the user does not want to edit anything, this is seen when the editing is done or canceled*/}
                                                    {editBrandId === brand.brandId ?  
                                                    <EditableRowBrand brand={brand} handleFormChange={handleFormChange} handleCancelClick={handleCancelClick}/> :
                                                    <ReadRowBrand brand = {brand} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>}  
                                                </Fragment>
                                            ))
                                        }                            
                                    </tbody>
                                </table>
                            </form>
                            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                                <h2>Create a new brand</h2>
                                <form onSubmit={handleAddFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                                    <label>Name </label>
                                    <input type="text" name="name" required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
                                    <label>Is defunct </label>
                                    <input type="checkbox" name="isDefunct" onChange={handleFormChange} style={inputStyle}/>
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

export default ManageBrands;