fetch(DataURL).then(res=>res.json()).then(
    data=>{
        // console.log(data, selectedFeature);
        if(selectedFeature.length===0)
            PCP("#pcp-2", data, features);
        else
            PCP("#pcp-2", data, selectedFeature);
    }
)
