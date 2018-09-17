function setUserData(data){
    let obj = {};
    obj.head_image_id = data.head_image_id
    obj.user_name = data.app_user_name
    return obj
}
export default{
    setUserData:setUserData
}