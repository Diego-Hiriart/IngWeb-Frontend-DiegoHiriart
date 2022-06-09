import React from 'react';
import { format } from 'date-fns';

const EditableRowModel = ({model, brands, handleFormChange, handleCancelClick}) => {
    const inputStyle = {'margin':'2px', 'width':'80%'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px'};
    return(
        <tr key={model.modelId} style={tableStyle}>
            <td style={tableStyle}>{model.modelId}</td>
            <td style={tableStyle}>
                <select name="brandId" id="brand" defaultValue={model.brandId} onChange={handleFormChange} style={inputStyle}>
                    {brands &&
                        brands.map(
                            (brand) =>(<option value={brand.brandId}>{brand.name}</option>)
                        )
                    }
                </select>
            </td>
            <td style={tableStyle}>
                <input type="text" name="modelNumber" defaultValue={model.modelNumber} required="required" placeholder="model number" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <input type="text" name="name" defaultValue={model.name} required="required" placeholder="name" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <input type="date" name="launch" defaultValue={format(new Date(model.launch), "yyy-MM-dd")} required="requiered" placeholder="launch date" onChange={handleFormChange} style={inputStyle}></input>
            </td>
            <td style={{tableStyle, textAlign:"center"}}>
                <input type="checkbox" defaultChecked={model.discontinued} name="discontinued" onChange={handleFormChange} style={inputStyle}/>
            </td>
            <td style={tableStyle}>
                <button type="submit" style={spacedStyle}>Save</button>
                <button type="button" onClick={handleCancelClick} style={spacedStyle}>Cancel</button>
            </td>
        </tr>
    )                            
}

export default EditableRowModel;