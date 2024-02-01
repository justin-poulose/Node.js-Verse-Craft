const express = require('express');
const axios = require('axios');

const app = express();

let post = [];
const dbURL= "http://localhost:8000/posts";
const fetchData = async () => {
    try {
        const response = await axios.get(dbURL); // Make GET request to dbURL
        post = response.data; // Store data in posts variable
        console.log("Data fetched successfully");
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
fetchData();

app.set('view engine','ejs');

app.listen(3000);

app.use(express.static('public'));
app.get('/',(req,res)=>{
    fetchData();
    res.render('index',{ title: 'Home', post });

});
app.get('/createpost',(req,res)=>{
    res.render('create',{ title: 'create'});
});
app.get('/sucessful',(req,res)=>{
    res.render('sucessful',{ title: 'sucessful'});
});
app.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const response = await axios.get(`${dbURL}/${postId}`);
        const postDetails = response.data;
        res.render('postDetails', { postDetails, title: 'post'});
    } catch (error) {
        console.error("Error fetching post details:", error);
        res.status(500).send("Error fetching post details");
    }
});

app.delete('/posts/:postId', (req, res) => {
    const postId = req.params.postId;
    fetch('http://localhost:8000/posts/' + postId, {
            method: 'DELETE',});
    res.sendStatus(204); 
});



app.use((req,res)=>{
    res.status(404).render('404',{ title: '404'});
})