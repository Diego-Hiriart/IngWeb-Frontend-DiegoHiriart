import {React, useEffect, useState, Fragment } from "react";
import ReadRowIssue from "./Components/ReadRowIssue";
import EditableRowIssue from "./Components/EditableRowIssue";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";
import { format } from 'date-fns';

function EditPost(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const urlGetPostBrand = 'https://ingweb-back-hiriart.herokuapp.com/api/brands/search/'
    const urlGetPostModel = 'https://ingweb-back-hiriart.herokuapp.com/api/models/search/'
    const urlGetIssues = 'https://ingweb-back-hiriart.herokuapp.com/api/issues/by-post/'
    const urlGetComponents = 'https://ingweb-back-hiriart.herokuapp.com/api/components'
    const [components, setComponents] = useState(null);//Empty by default
    const [postModel, setPostModel] = useState(null);//Empty by default
    const [postBrand, setPostBrand] = useState(null);//Empty by default
    const [issues, setIssues] = useState(null);//Empty by default
    const editPost = JSON.parse(localStorage.getItem("hlEditPost"));
    const [editIssueId, setEditIssueId] = useState(null);//To check if someting is being edited
    const [postForm, setPostForm] = useState({
        postId : editPost.postId,
        userId : editPost.userId,
        modelId : editPost.modelId,
        postDate :	editPost.postDate,
        purchase :	editPost.purchase,
        firstIssues :	editPost.firstIssues,
        innoperative :	editPost.innoperative,
        review : editPost.review
    })
    const [issueForm, setIssueForm] = useState({
        issueId : 0,
        postId : 0,
        componentId : 0,
        issueDate :	'',
        isFixable :	false,
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
        }else if(response == 401){
            setIs401(true)
        }else if(response == 403){
            setIs401(false)
        }
        if(response != 401){
            getPostModel();//if permissions exist, get post info
            getIssues();
            getComponents();
        }
        console.log(response)
    }, [response])

    const getPostModel = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlGetPostModel+editPost.modelId, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => {setPostModel(json); getPostBrand(json[0].brandId)});
            }else{
                console.log("GET model failed");
            }
        })
    }

    const getPostBrand = async (brandId) => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlGetPostBrand+brandId, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setPostBrand(json));
            }else{
                console.log("GET brand failed");
            }
        })
    }

    const getIssues = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlGetIssues+editPost.postId, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setIssues(json));
            }
        })
    }

    //Function to send GET request
    const getComponents = async () => {
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

    const handlePostFormChange = (event) => {
        var fieldValue = event.target.value;//Get the value of the field
        event.preventDefault();

        console.log(fieldValue);
        
        const fieldName = event.target.getAttribute("name");//Get the name field

        const postFormData = {...postForm}//Get the current state of newBorrowing
        postFormData[fieldName] = fieldValue//Update the value of a field

        setPostForm(postFormData);
    };

    const handleIssueFormChange = (event) => {
        var fieldValue;
        if(event.target.type != "checkbox"){
            fieldValue = event.target.value;//Get the value of the field
            event.preventDefault();
        }else{
            fieldValue = event.target.checked;//get if it checked (true or false), value will return "on" or nothing
            //Putting an event.preventDefault(); here makes the checkbox need 2 clicks to change states, dont know why
        }
        
        const fieldName = event.target.getAttribute("name");//Get the name field

        const issueFormData = {...issueForm}//Get the current state of newBorrowing
        issueFormData[fieldName] = fieldValue//Update the value of a field

        setIssueForm(issueFormData);
    };

    const handleAddFormSubmit = (event) => {
        event.preventDefault();

        const create = async (issue) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/issues';
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' , 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken"))},
                body: JSON.stringify(issue)
            };
            console.log(JSON.stringify(issue))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Issue created successfully")
                        getIssues();//Updates table
                    }else{
                        console.log("Creation error");
                    }
                }); 
        }

        const newIssue = {
            postId : editPost.postId,
            componentId : issueForm.componentId,
            issueDate :	issueForm.issueDate,
            isFixable :	issueForm.isFixable,
            description : issueForm.description
        }

        create(newIssue);
    }

    const handlePostEditFormSubmit = (event) => {
        event.preventDefault();

        const edit = async (post) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/posts';
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
                body: JSON.stringify(post)
            };
            console.log(JSON.stringify(post))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        alert("Post updated");
                    }else{
                        console.log("Edit error");
                    }
                }); 
        }

        const editedPost = {
            postId : editPost.postId,
            userId : editPost.userId,
            modelId : postForm.modelId,
            postDate : editPost.postDate,
            purchase :	postForm.purchase,
            firstIssues :	postForm.firstIssues,
            innoperative :	postForm.innoperative,
            review : postForm.review
        }

        edit(editedPost);
    }

    const handleIssueEditFormSubmit = (event) => {
        event.preventDefault();

        const edit = async (issue) => {
            const urlPost = 'https://ingweb-back-hiriart.herokuapp.com/api/issues';
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 
                'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) },
                body: JSON.stringify(issue)
            };
            console.log(JSON.stringify(issue))
            await fetch(urlPost, requestOptions)
                .then(res => {
                    if(res.ok){
                        getIssues();//Updates table
                        setEditIssueId(null)//Exits the editing row by changing the state (this causes a reload)
                    }else{
                        console.log("Edit error");
                    }
                }); 
        }

        const editedIssue = {
            issueId : editIssueId,
            postId : editPost.postId,
            componentId : issueForm.componentId,
            issueDate :	issueForm.issueDate,
            isFixable :	issueForm.isFixable,
            description : issueForm.description
        }

        edit(editedIssue);
    }

    const handleEditClick = (event, issue) => {
        event.preventDefault();

        setEditIssueId(issue.issueId);
        const formValues = {
            issueId : issue.issueId,
            postId : issue.postId,
            componentId : issue.componentId,
            issueDate :	issue.issueDate,
            isFixable :	issue.isFixable,
            description : issue.description
        }

        setIssueForm(formValues);
    } 

    const handleCancelClick = () =>{
        setEditIssueId(null)//Returns to null, this causes a reload on which the editable row is not rendered
    }

    const handlePostDeleteClick = async () => {
        const urlDel = 'https://ingweb-back-hiriart.herokuapp.com/api/posts/';
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlDel+editPost.postId, requestOptions)
            .then(res => {
                if(res.ok){
                    alert("Post deleted successfully")
                }else{
                    console.log("Deletion failed")
                }
            }) 
    }

    const handleIssueDeleteClick = async (issueId) => {
        const urlDel = 'https://ingweb-back-hiriart.herokuapp.com/api/issues/';
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("hlAuthToken")) }
        };
        await fetch(urlDel+issueId, requestOptions)
            .then(res => {
                if(res.ok){
                    getIssues();//Reload due to a state change
                }else{
                    console.log("Deletion failed")
                }
            }) 
    }

    let content = 
        <div className="container" style={{margin:'6px', alignItems:'center'}}>
            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <h2>Edit a post</h2>
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
        if(editPost && postModel && postBrand){//If posts, postModel, and postBrand arrays have content
            content =
            <div className="container" style={{margin:'0px'}}>
                <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                    <h2>Edit a post</h2>
                    <p>You can edit and delete a post and it's issues here</p> 
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', width: '70%'}}>
                    <form onSubmit={handlePostEditFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                        <label>Brand </label>
                        <input type="text" defaultValue={postBrand[0].name} disabled={true} style={inputStyle}></input>
                        <label>Model </label>
                        <input type="text" defaultValue={postModel[0].name} disabled={true} style={inputStyle}></input>
                        <label>Date of Purchase</label>
                        <input type="date" name="purchase" required="required" defaultValue={format(new Date(editPost.purchase), "yyy-MM-dd")} 
                        placeholder="purchase date" onChange={handlePostFormChange} style={inputStyle}></input>
                        <label>Date first issues appeared</label>
                        {editPost.firstIssues != null ? 
                            <input type="date" name="firstIssues" defaultValue={format(new Date(editPost.firstIssues), "yyy-MM-dd")}
                            placeholder="first issues date" onChange={handlePostFormChange} style={inputStyle}></input>
                            : 
                            <input type="date" name="firstIssues" placeholder="first issues date" onChange={handlePostFormChange} style={inputStyle}></input>
                        }
                        <label>Date product became innoperative</label>
                        {editPost.innoperative != null ? 
                            <input type="date" name="innoperative" defaultValue={format(new Date(editPost.innoperative), "yyy-MM-dd")}
                            placeholder="innoperative date" onChange={handlePostFormChange} style={inputStyle}></input>
                            :
                            <input type="date" name="innoperative" placeholder="innoperative date" onChange={handlePostFormChange} style={inputStyle}></input>
                        }
                        <label>Review </label>
                        <input type="text" name="review" required="required" defaultValue={editPost.review} placeholder="review" onChange={handlePostFormChange} style={inputStyle}/>
                        <button type="submit" style={spacedStyle}>Save changes</button>
                        <button type="button" style={spacedStyle} onClick={handlePostDeleteClick}>Delete post</button>
                    </form>
                </div>
                <br/>
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                    <form onSubmit={handleIssueEditFormSubmit}>
                        <table style={{tableStyle}}>
                            <thead>
                                <tr>
                                    <th style={tableStyle}>Issue ID</th>
                                    <th style={tableStyle}>Post ID</th>
                                    <th style={tableStyle}>Component</th>
                                    <th style={tableStyle}>Date</th>
                                    <th style={tableStyle}>is Fixable</th>
                                    <th style={tableStyle}>Description</th>
                                    <th style={tableStyle}>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues ?
                                    issues.map((issue) => (
                                        <Fragment>
                                            {/*If editIssueId equals the id of this row's issue it means the button was clicked and the editable row must be rendered, 
                                            if it is null it means the user does not want to edit anything, this is seen when the editing is done or canceled*/}
                                            {editIssueId === issue.issueId ?  
                                            <EditableRowIssue issue={issue} components = {components} handleIssueFormChange={handleIssueFormChange} handleCancelClick={handleCancelClick}/> :
                                            <ReadRowIssue issue = {issue} components = {components} handleEditClick={handleEditClick} handleIssueDeleteClick={handleIssueDeleteClick}/>}  
                                        </Fragment>
                                    ))
                                    : ""
                                }                            
                            </tbody>
                        </table>
                    </form>
                </div>
                <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                    <h2>Register a new Issue</h2>
                    <form onSubmit={handleAddFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>                            
                        <label>Affected component </label>
                        <select name="componentId" id="component" required="required" defaultValue={"default"} onChange={handleIssueFormChange} style={inputStyle}>
                            <option value={"default"} ></option>
                            {components &&
                                components.map(
                                    (component) =>(<option value={component.componentId}>{component.name}</option>)
                                )
                            }
                        </select>
                        <label>Issue date </label>
                        <input type="date" name="issueDate" required="required" placeholder="issue date" onChange={handleIssueFormChange} style={inputStyle}></input>
                        <label>Is fixable </label>
                        <input type="checkbox" name="isFixable" onChange={handleIssueFormChange}/>
                        <label>Description </label>
                        <input type="text" required="required" name="description" onChange={handleIssueFormChange}/>
                        <button type="submit" style={spacedStyle}>Add issue</button>
                    </form>
                </div>
            </div>
        }
    }

    return(
        <div style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
            {content}
        </div>
    )
}

export default EditPost;