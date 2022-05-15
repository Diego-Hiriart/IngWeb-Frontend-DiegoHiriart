import React from 'react';
import { format } from 'date-fns';

const EditableRowBrand = ({model, brands, handleFormChange, handleCancelClick}) => {
    const inputStyle = {'margin':'2px'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={brand.brandId} style={tableStyle}>
            <td style={tableStyle}>{brand.brandId}</td>
            <td style={tableStyle}>
                <input type="text" name="name" defaultValue={brand.name} required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={{tableStyle, textAlign:"center"}}>
                <input type="checkbox" defaultChecked={brand.isDefunct} name="isDefunct" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <button type="submit" style={spacedStyle}>Save</button>
                <button type="button" onClick={handleCancelClick} style={spacedStyle}>Cancel</button>
            </td>
        </tr>
    )                            
}

export default EditableRowBrand;