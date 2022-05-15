import React from 'react';
import { format } from 'date-fns';

const ReadRowBrand = ({model, handleEditClick, handleDeleteClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={model.modelId} style={tableStyle}>            
            <td style={tableStyle}>{model.modelId}</td>
            <td style={tableStyle}>{model.brandId}</td>
            <td style={tableStyle}>{model.modelNumber}</td>
            <td style={tableStyle}>{model.name}</td>
            <td style={tableStyle}>{format(new Date(model.launch), "yyy-MM-dd")}</td>
            <td style={{tableStyle, textAlign:"center"}}><input type="checkbox" checked={model.discontinued} disabled={true}/></td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, brand)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
                <button type="button" onClick={() => handleDeleteClick(brand.brandId)} style={spacedStyle}>Delete</button>
            </td>
        </tr>
    )
}

export default ReadRowBrand;