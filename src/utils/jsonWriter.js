const fs=require('fs');
const path=require('path');
const subjectsFilepath=path.join(__dirname,'../data/subjects.json');
const topicsFilePath=path.join(__dirname,'../data/topics.json');
function writeSubjects(subjectsArr){
try{
    fs.writeFileSync(subjectsFilepath,JSON.stringify(subjectsArr,null,2),'utf-8');
}catch(err){
    console.log("Error While writing subjects: ",err.message);
}
}
function writeTopics(topicsArr){
    try{
        fs.writeFileSync(topicsFilePath,JSON.stringify(topicsArr,null,2),'utf-8');
    }catch(err){
        console.log("Error occured while writing topics: ",err.message);
    }
}
module.exports={writeSubjects,writeTopics};
