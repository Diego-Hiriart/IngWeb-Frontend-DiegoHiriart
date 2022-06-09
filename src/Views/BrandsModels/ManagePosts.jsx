import {React, useEffect, useState, Fragment } from "react";
import ReadRowPost from "./Components/ReadRowPost";
import { useNavigate } from "react-router-dom";
import AuthCheck from "../../Components/AuthCheck";
import { format } from 'date-fns';

function CreatePost(){
    let navigate = useNavigate();
    const [response, setResponse] = useState(null)
    const [is401, setIs401] = useState(true);
    const urlGetPosts = 'https://localhost:7017/api/posts/by-user-auto'
    const urlGetModels = 'https://localhost:7017/api/models/get-all'
    const [posts, setPosts] = useState(null);//Empty by default
    const [models, setModels] = useState(null);//Empty by default
    const [editPostId, setEditPostId] = useState(null);//To check if someting is being edited
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
            getUserPosts();//if permissions exist, get all posts from current user
            getModels();//Get all models to fill up rows
        }else if(response == 401){
            setIs401(true)
        }else if(response == 403){
            setIs401(false)
        }
        console.log(response)
    }, [response])

    //Function to send GET request
    const getUserPosts = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 
            'Authorization':"bearer "+JSON.parse(localStorage.getItem("authToken")) }
        };
        await fetch(urlGetPosts, requestOptions)
        .then(res => {
            if(res.ok){
                res.json()
                .then(json => setPosts(json));
            }
        })
    }

    //Function to send GET request, must still be fixed, shouldnt be getting all models, maybe just the ones linked to the user's posts (by post id or user id)
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

    const handleEditClick = (event, post) => {
        event.preventDefault();

        setEditPostId(post.postId);
        const formValues = {
            postId : post.postId,
            userId : post.userId,
            modelId : post.modelId,
            postDate :	post.postDate,
            purchase :	post.purchase,
            firstIssues :	post.firstIssues,
            innoperative :	post.innoperative,
            review : post.review
        }

        setPostForm(formValues);
    }

    let content = 
        <div className="container" style={{margin:'6px'}}>
            <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                <h2>Manage your posts</h2>
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
        if(posts){//If brands array has content
            content =
            <div className="container" style={{margin:'6px'}}>
                <div style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                    <h2>Manage your posts</h2>
                    <p>You can edit and delete posts and issues here</p> 
                </div>
                <div style={{display: 'flex',  justifyContent:'space-evenly', alignItems:'center', width: '70%'}}>
                    <table style={{tableStyle}}>
                        <thead>
                            <tr style={tableStyle}>
                                <th style={tableStyle}>Post ID</th>
                                <th style={tableStyle}>Model</th>
                                <th style={tableStyle}>Posted on</th>
                                <th style={tableStyle}>Purchaed</th>
                                <th style={tableStyle}>First issues appeared</th>
                                <th style={tableStyle}>Innoperative on</th>
                                <th style={tableStyle}>Review</th>
                                <th style={tableStyle}>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts != null && models != null ?
                                posts.map((post) => (
                                    <Fragment>
                                        <ReadRowPost post = {post} models={models} handleEditClick={handleEditClick}/>
                                    </Fragment>
                                ))
                                : ""
                            }                            
                        </tbody>
                    </table>
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

export default CreatePost;