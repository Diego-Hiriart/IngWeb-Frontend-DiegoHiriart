import {React, useState } from "react";

function AdvancedSearch(){
    const urlAdvancedSearch = `${process.env.REACT_APP_API_URL}/api/stats/filter`;
    const [searchResults, setSearchResults] = useState(null);
    const [filterForm, setFilterForm] = useState({
        minReviews : 0,
        minLifeSpanYears : 0,
        minIssueFreeYears : 0,
        maxPercentIssues : 0,
        minPercentFixableIssues : 0
    })

    const durationString = (days) =>{
        var years = Math.floor(days/365);
        var months = Math.floor((days % 365) / 30);
        var days = Math.floor((days % 365) % 30);

        return years + " year(s) " + months + " month(s) " + days + " day(s) ";
    }

    const inputStyle = {'margin':'2px'};
    const spacedStyle = {'margin':'2px'};
    const tableStyle = {"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid', 'padding':'5px', 'overflow':'auto'};

    const handleFormChange = (event) => {
        var fieldValue = event.target.value;//Get the value of the field
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");//Get the name field

        if(fieldName == "maxPercentIssues" || fieldName == "minPercentFixableIssues"){
            fieldValue /= 100;
        }

        const filterFormData = {...filterForm}//Get the current state of newBorrowing
        filterFormData[fieldName] = fieldValue//Update the value of a field

        setFilterForm(filterFormData);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const searchModels = async (searchFilter) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(searchFilter)
            };
            console.log(JSON.stringify(searchFilter))
            await fetch(urlAdvancedSearch, requestOptions)
                .then(res => {
                    if(res.ok){
                        res.json()
                        .then(json => setSearchResults(json));
                    }else{
                        console.log("Search error");
                    }
                }); 
        }

        const searchFilter = {
            minReviews : filterForm.minReviews,
            minLifeSpanYears : filterForm.minLifeSpanYears,
            minIssueFreeYears : filterForm.minIssueFreeYears,
            maxPercentIssues : filterForm.maxPercentIssues,
            minPercentFixableIssues : filterForm.minPercentFixableIssues
        }

        searchModels(searchFilter);
    }
    
    let content = 
        <div className="container" style={{margin:'6px'}}>
            <div style={{display: 'flex', flexDirection:"column",  justifyContent:'normal', alignItems:'center', width: '70%'}}>
                <h1>Advanced search</h1>
                <p>Fill out these search parameters to look for products that match your requirements</p>  
            </div>
            <div style={{display: 'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', width: '100%'}}>
                <form onSubmit={handleFormSubmit} style={{display: 'flex', flexDirection:"column", justifyContent:'space-evenly', alignItems:'normal', width: '70%'}}>
                    <label>Minimum number of reviews </label>
                    <input type="text" name="minReviews" placeholder="minimum reviews" onChange={handleFormChange} style={inputStyle}></input>
                    <label>Minimum life span (in years) </label>
                    <input type="text" name="minLifeSpanYears" placeholder="life span" onChange={handleFormChange} style={inputStyle}></input>
                    <label>Minimun time without issues (in years) </label>
                    <input type="text" name="minIssueFreeYears" placeholder="issue free time span" onChange={handleFormChange} style={inputStyle}></input>
                    <label>Maximum percentage of reviews with issues for any component </label>
                    <input type="text" name="maxPercentIssues" placeholder="max issues" onChange={handleFormChange} style={inputStyle}></input>
                    <label>Minimum percentage of issues that can be fixed for any component </label>
                    <input type="text" name="minPercentFixableIssues" placeholder="minimum issues fixable" onChange={handleFormChange} style={inputStyle}></input>
                    <button type="submit" style={spacedStyle}>Search</button>
                </form>
                <br></br>
                <table>
                    <thead>
                        <tr style={tableStyle}>
                            <th style={tableStyle}>Model</th>
                            <th style={tableStyle}>Brand</th>
                            <th style={tableStyle}>Reviews</th>
                            <th style={tableStyle}>Life span</th>
                            <th style={tableStyle}>Issue free span</th>
                        </tr>
                        {searchResults && console.log(searchResults)}
                    </thead>
                    {searchResults &&                       
                        searchResults.results.map(modelStats =>
                            <tbody> 
                                <td style={tableStyle}>{modelStats.model.name}</td>
                                <td style={tableStyle}>{modelStats.brand.name}</td>
                                <td style={tableStyle}>{modelStats.totalReviews}</td>
                                <td style={tableStyle}>{durationString(modelStats.lifeSpan)}</td>
                                <td style={tableStyle}>{durationString(modelStats.issueFree)}</td>
                            </tbody>
                        )
                    }
                </table>
            </div>
        </div>
    
    return(
        <div>
            {content}
        </div>
    )
}

export default AdvancedSearch

