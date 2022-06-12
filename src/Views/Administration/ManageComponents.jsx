import {React, useEffect, useState, Fragment } from "react";
import ReadRowComponent from './Components/ReadRowComponent';
import EditableRowComponent from './Components/EditableRowComponent';
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";

function ManageComponents(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const [is403, setIs403] = useState(true);
    const urlGetComponents = 'https://ingweb-back-hiriart.herokuapp.com/api/components'
    const [components, setComponents] = useState(null);//Empty by default
    const [editComponentId, setEditComponentId] = useState(null);//To check if someting is being edited
    const [componentForm, setComponentForm] = useState({
        componentId : '',
        name : '',
        description : ''
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
            getAll();//if permissions exist, get all components
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
            headers: { 'Content-Type': 'application/json',
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
        };
        await fetch(urlGetComponents, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setComponents(json));
            }else{
                console.log("GET components failed");
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

        const newFormData = {...componentForm}//Get the current state of newBorrowing
        newFormData[fieldName] = fieldValue//Update the value of a field

        setComponentForm(newFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const create = async (component) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/components';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
                body: JSON.stringify(component)
            };
            console.log(JSON.stringify(component))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Component created successfully")
                        getAll();//Updates table
                    }else{
                        console.log("Creation error");
                    }
                }); 
        }

        const newComponent = {
            name : componentForm.name,
            description : componentForm.description
        }

        create(newComponent);
    }

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const edit = async (component) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/components';
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
                body: JSON.stringify(component)
            };
            console.log(JSON.stringify(component))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        getAll();//Updates table
                        setEditComponentId(null)//Exits the editing row by changing the state (this causes a reload)
                    }else{
                        console.log("Edit error");
                    }
                }); 
        }

        const editedComponent = {
            componentId : editComponentId,
            name : componentForm.name,
            description : componentForm.description
        }

        edit(editedComponent);
    }

    const handleEditClick = (event, component) => {
        event.preventDefault();

        setEditComponentId(component.componentId);
        const formValues = {
            componentId : component.componentId,
            name : component.name,
            description : component.description
        }

        setComponentForm(formValues);
    } 

    const handleCancelClick = () =>{
        setEditComponentId(null)//Returns to null, this causes a reload on which the editable row is not rendered
    }

    const handleDeleteClick = async (componentId) => {
        const urlDel = 'https://ingweb-back-hiriart.herokuapp.com/api/components/';
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlDel+componentId, requestOptions)
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
                <h1>Manage Components</h1>
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
            if(components){//If components array has content
                content =
                    <div className="container" style={{margin:'6px'}}>
                        <h1>Manage Components</h1>
                        <div style={{display: 'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', width: '100%'}}>
                            <form onSubmit={handleEditFormSubmit}>
                                <table style={{tableStyle}}>
                                    <thead>
                                        <tr style={tableStyle}>
                                            <th style={tableStyle}>Component ID</th>
                                            <th style={tableStyle}>Name</th>
                                            <th style={tableStyle}>Description</th>
                                            <th style={tableStyle}>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {components &&
                                            components.map((component) => (
                                                <Fragment>
                                                    {/*If editComponentId equals the id of this row's component it means the button was clicked and the editable row must be rendered, 
                                                    if it is null it means the user does not want to edit anything, this is seen when the editing is done or canceled*/}
                                                    {editComponentId === component.componentId ?  
                                                    <EditableRowComponent component={component} handleFormChange={handleFormChange} handleCancelClick={handleCancelClick}/> :
                                                    <ReadRowComponent component = {component} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>}  
                                                </Fragment>
                                            ))
                                        }                            
                                    </tbody>
                                </table>
                            </form>
                            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                                <h2>Create a new Component</h2>
                                <form onSubmit={handleAddFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                                    <label>Name </label>
                                    <input type="text" name="name" required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
                                    <label>Description </label>
                                    <input type="text" name="description" required="required" placeholder="description" onChange={handleFormChange} style={inputStyle}/>
                                    <button type="submit" style={spacedStyle}>Add component</button>
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

export default ManageComponents;