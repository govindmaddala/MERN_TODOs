import axios from 'axios';

const redirectURL = axios.create({
    baseURL:"http://localhost:5000/"
})

export default redirectURL;