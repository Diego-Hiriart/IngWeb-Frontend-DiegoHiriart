import React from 'react';

const ReadRowComponent = ({component, handleEditClick, handleDeleteClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={component.componentId} style={tableStyle}>            
            <td style={tableStyle}>{component.componentId}</td>
            <td style={tableStyle}>{component.name}</td>
            <td style={tableStyle}>{component.description}</td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, component)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
                <button type="button" onClick={() => handleDeleteClick(component.componentId)} style={spacedStyle}>Delete</button>
            </td>
        </tr>
    )
}

export default ReadRowComponent;