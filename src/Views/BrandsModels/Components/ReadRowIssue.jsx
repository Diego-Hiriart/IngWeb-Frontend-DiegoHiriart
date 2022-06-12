import React from 'react';
import { Component } from 'react';
import { format } from 'date-fns';

const ReadRowIssue = ({issue, components, handleEditClick, handleIssueDeleteClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    var componentName;
    return(
        <tr key={issue.issueId} style={tableStyle}>            
            <td style={tableStyle}>{issue.issueId}</td>
            <td style={tableStyle}>{issue.postId}</td>
            {components.forEach(component => {//Show the component name, easier to read
                if(component.componentId == issue.componentId){
                    componentName = component.name
                }
            })}
            <td style={tableStyle}>{componentName}</td>
            <td style={tableStyle}>{format(new Date(issue.issueDate), "yyy-MM-dd")}</td>
            <td style={{tableStyle, textAlign:"center"}}><input type="checkbox" checked={issue.isFixable} disabled={true}/></td>
            <td style={tableStyle}>{issue.description}</td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, issue)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
                <button type="button" onClick={() => handleIssueDeleteClick(issue.issueId)} style={spacedStyle}>Delete</button>
            </td>
        </tr>
    )
}

export default ReadRowIssue;