import React from 'react';
import { format } from 'date-fns';

const EditableRowIssue = ({issue, components, handleIssueFormChange, handleCancelClick}) => {
    const inputStyle = {'margin':'2px', 'width':'80%'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={issue.issueId} style={tableStyle}>            
            <td style={tableStyle}>{issue.issueId}</td>
            <td style={tableStyle}>{issue.postId}</td>
            <td style={tableStyle}>
                <select name="componentId" id="component" required="required" defaultValue={issue.componentId} onChange={handleIssueFormChange} style={inputStyle}>
                    {components &&
                        components.map(
                            (component) =>(<option value={component.componentId}>{component.name}</option>)
                        )
                    }
                </select>
            </td>
            <td style={tableStyle}>
            <input type="date" name="issueDate" defaultValue={format(new Date(issue.issueDate), "yyy-MM-dd")} required="required" placeholder="issue date" onChange={handleIssueFormChange} style={inputStyle}></input>
            </td>
            <td style={{tableStyle, textAlign:"center"}}>
                <input type="checkbox" style={inputStyle} name="isFixable" defaultChecked={issue.isFixable} onChange={handleIssueFormChange}/>
            </td>
            <td style={tableStyle}>
                <input type="text" style={inputStyle} name="description" defaultValue={issue.description} onChange={handleIssueFormChange}/>
            </td>
            <td style={tableStyle}>
                <button type="submit" style={spacedStyle}>Save</button>
                <button type="button" onClick={handleCancelClick} style={spacedStyle}>Cancel</button>
            </td>
        </tr>
    )                            
}

export default EditableRowIssue;