import axios from 'axios';

const redirectURL = axios.create({
    baseURL:"http://localhost:5000/"
    // baseURL:"https://tasty-dog-long-johns.cyclic.app"
})

export default redirectURL;