const distKm = ([long1,lat1],[long2,lat2])=>{
    long1=long1/57.29577951
    long2=long2/57.29577951
    lat1=lat1/57.29577951
    lat2=lat2/57.29577951
    return 3963*Math.acos(Math.sin(lat1) * Math.sin(lat2) +Math.cos(lat1) *Math.cos(lat2) *Math.cos(long2 - long1))
    
}

module.exports={distKm}