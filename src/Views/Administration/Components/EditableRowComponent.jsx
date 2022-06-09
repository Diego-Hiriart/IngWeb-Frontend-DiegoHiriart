import React from 'react';

const EditableRowComponent = ({component, handleFormChange, handleCancelClick}) => {
    const inputStyle = {'margin':'2px', 'width':'80%'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={component.componentId} style={tableStyle}>
            <td style={tableStyle}>{component.componentId}</td>
            <td style={tableStyle}>
                <input type="text" name="name" defaultValue={component.name} required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <input type="text" name="description" defaultValue={component.description} required="required" placeholder="description" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <button type="submit" style={spacedStyle}>Save</button>
                <button type="button" onClick={handleCancelClick} style={spacedStyle}>Cancel</button>
            </td>
        </tr>
    )                            
}

export default EditableRowComponent;