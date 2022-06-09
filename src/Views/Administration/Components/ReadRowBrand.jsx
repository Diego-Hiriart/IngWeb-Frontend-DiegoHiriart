import React from 'react';

const ReadRowBrand = ({brand, handleEditClick, handleDeleteClick}) => {
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={brand.brandId} style={tableStyle}>            
            <td style={tableStyle}>{brand.brandId}</td>
            <td style={tableStyle}>{brand.name}</td>
            <td style={{tableStyle, textAlign:"center"}}><input type="checkbox" checked={brand.isDefunct} disabled={true}/></td>
            <td style={tableStyle}>
                <button type="button" onClick={(event) => handleEditClick(event, brand)} style={spacedStyle}>Edit</button>{/*Lets us use  the editable row when clicking*/}
                <button type="button" onClick={() => handleDeleteClick(brand.brandId)} style={spacedStyle}>Delete</button>
            </td>
        </tr>
    )
}

export default ReadRowBrand;