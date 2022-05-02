export const BASE_URL = 'https://api.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/singup`, {
    method: 'POST',
    headers: {
      
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response) => {
    return response.json();
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(err));
};
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}singin`, {
    method: 'POST',
    headers: {
       
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
  .then((response => response.json()))
  .then((data) => {
    if (data){
      localStorage.setItem('jwt', data.token);
      
      return data;
    } 
  })
  .catch(err => console.log(err))
};
export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => res.json())
  .then((res) => { return res;})
  .catch(err => console.log(err))
}
