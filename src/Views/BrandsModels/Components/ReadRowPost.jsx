import React from 'react';
import { format } from 'date-fns';

const ReadRowPost = ({post, models, handleEditClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    var modelName;
    return(
        <tr key={post.postId} style={tableStyle}>            
            <td style={tableStyle}>{post.postId}</td>
            {models.forEach(model => {//Show the model name, easier to read
                if(model.modelId == post.modelId){
                    modelName = model.name
                }
            })}
            <td style={tableStyle}>{modelName}</td>
            <td style={tableStyle}>{format(new Date(post.postDate), "yyy-MM-dd")}</td>
            <td style={tableStyle}>{format(new Date(post.purchase), "yyy-MM-dd")}</td>
            {post.firstIssues == null ? 
                <td style={tableStyle}>N/A</td>
                :
                <td style={tableStyle}>{format(new Date(post.firstIssues), "yyy-MM-dd")}</td>
            }
            {post.innoperative == null ?
                <td style={tableStyle}>N/A</td>
                :
                <td style={tableStyle}>{format(new Date(post.innoperative), "yyy-MM-dd")}</td>
            }
            <td style={tableStyle}>{post.review}</td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, post)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
            </td>
        </tr>
    )
}

export default ReadRowPost;