import {React, useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";
import { format } from 'date-fns';

function CreatePost(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const urlGetBrands = 'https://ingweb-back-hiriart.herokuapp.com/api/brands'
    const urlGetBrandModels = 'https://ingweb-back-hiriart.herokuapp.com/api/models/by-brand/'
    const [models, setModels] = useState(null);//Empty by default
    const [brands, setBrands] = useState(null);//Empty by default, needed for creation and editing
    const [postForm, setPostForm] = useState({
        postId : 0,
        userId : 0,
        modelId : 0,
        postDate :	'',
        purchase :	'',
        firstIssues :	null,
        innoperative :	null,
        review : ''
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
        }else if(response == 401){
            setIs401(true)
        }else if(response == 403){
            setIs401(false)
        }
        console.log(response)
        if(response != 401){
            getBrands();//if permissions exist, get all brands
        }
    }, [response])

    const handleFormChange = (event) => {
        var fieldValue = event.target.value;//Get the value of the field
        event.preventDefault();

        console.log(fieldValue);
        
        const fieldName = event.target.getAttribute("name");//Get the name field

        const newFormData = {...postForm}//Get the current state of newBorrowing
        newFormData[fieldName] = fieldValue//Update the value of a field

        setPostForm(newFormData);
    };

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

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const create = async (post) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/posts';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
                body: JSON.stringify(post)
            };
            console.log(JSON.stringify(post))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Post created successfully")
                    }else if(res.status == 400){
                        alert("The current user has already made a post for this model")
                        console.log("Creation error, the current user has already made a post for this model");
                    }
                }); 
        }

        const newPost = {
            postId : 0,
            userId : 0,
            modelId : postForm.modelId,
            postDate :	format(new Date(), "yyy-MM-dd"),
            purchase :	postForm.purchase,
            firstIssues :	postForm.firstIssues,
            innoperative :	postForm.innoperative,
            review : postForm.review
        }

        create(newPost);
    }

    let content = 
        <div className="container" style={{margin:'6px'}}>
            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <h2>Create a new Post</h2>
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
        if(!is401){
            if(brands){//If brands array has content
                content =
                    <div style={{display: 'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', width: '70%', margin:'0px'}}>
                        <h2>Create a new Post</h2>
                        <form onSubmit={handleAddFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                            <label>Brand </label>
                            <select name="brandId" id="brand" defaultValue={"default"} onChange={getBrandModels} style={inputStyle}>
                                    <option value={"default"} disabled>Choose an option</option>
                                    {brands &&
                                        brands.map(
                                            (brand) =>(<option value={brand.brandId}>{brand.name}</option>)
                                        )
                                    }
                                </select>
                            <label>Model </label>
                            <select name="modelId" id="model" defaultValue={"default"} onChange={handleFormChange} style={inputStyle}>
                                <option value={"default"} disabled>Choose an option</option>
                                {models &&
                                    models.map(
                                        (model) => (<option value={model.modelId}>{model.name} ({model.modelNumber})</option>)
                                    )
                                }
                            </select>
                            <label>Date of Purchase</label>
                            <input type="date" name="purchase" required="required" placeholder="purchase date" onChange={handleFormChange} style={inputStyle}></input>
                            <label>Date first issues appeared</label>
                            <input type="date" name="firstIssues" placeholder="first issues date" onChange={handleFormChange} style={inputStyle}></input>
                            <label>Date product became innoperative</label>
                            <input type="date" name="innoperative" placeholder="innoperative date" onChange={handleFormChange} style={inputStyle}></input>
                            <label>Review </label>
                            <input type="text" name="review" required="required" placeholder="review" onChange={handleFormChange} style={inputStyle}/>
                            <button type="submit" style={spacedStyle}>Add post</button>
                        </form>
                    </div>
            }
        }
    }

    return(
        <div style={{display:'flex', justifyContent:'center'}}>
            {content}
        </div>
    )
}

export default CreatePost;