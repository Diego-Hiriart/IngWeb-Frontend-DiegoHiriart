import React from 'react';
import { format } from 'date-fns';

const ReadRowModel = ({model, brands, handleEditClick, handleDeleteClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    var brandName;
    return(
        <tr key={model.modelId} style={tableStyle}>            
            <td style={tableStyle}>{model.modelId}</td>
            {brands.forEach(brand => {//Show the brand name, easier to read
                if(brand.brandId == model.brandId){
                    brandName = brand.name
                }
            })}
            <td style={tableStyle}>{brandName}</td>
            <td style={tableStyle}>{model.modelNumber}</td>
            <td style={tableStyle}>{model.name}</td>
            <td style={tableStyle}>{format(new Date(model.launch), "yyy-MM-dd")}</td>
            <td style={{tableStyle, textAlign:"center"}}><input type="checkbox" checked={model.discontinued} disabled={true}/></td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, model)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
                <button type="button" onClick={() => handleDeleteClick(model.modelId)} style={spacedStyle}>Delete</button>
            </td>
        </tr>
    )
}

export default ReadRowModel;