
export default  function call(uri, method, body = false, error_message = "Something went wrong"){
  if(body !== false && method!=="GET" && method!=="DELETE"){
    body = JSON.stringify(body);
  }
  return fetch('http://crmbetd.azurewebsites.net/'+uri,{method: method,
    headers: {'Accept': 'application/json','Content-Type': 'application/json', 'Authorization': 'Bearer '+sessionStorage.getItem("token")},
    body : body,
    }
  )
  .then(function(response){
    if (!response.ok) {
      return {error: true, message: error_message};
    }
    return response;
  })
  .then(response => response.json())
  .catch((error) => {
      return {error: true, message: error_message};
    });
}