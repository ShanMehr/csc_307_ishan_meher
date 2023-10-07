import express from "express";
import cors from 'cors';
const app = express();
const port = 8000;

// hashmap of ids
let id_map = new Map();

const users = { 
   users_list :
   [
      { 
         id : 'xyz789',
         name : 'Charlie',
         job: 'Janitor',
      },
      {
         id : 'abc123', 
         name: 'Mac',
         job: 'Bouncer',
      },
      {
         id : 'ppp222', 
         name: 'Mac',
         job: 'Professor',
      }, 
      {
         id: 'yat999', 
         name: 'Dee',
         job: 'Aspring actress',
      },
      {
         id: 'zap555', 
         name: 'Dennis',
         job: 'Bartender',
      }
   ]
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    // Find User by Name and Job
    if(name !=undefined && job!=undefined) {
      let result = findUserByNameJob(name,job);
      result = {users_list: result};
      res.send(result);
    }
    else if (name != undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByNameJob = (name,job) => { 
    return users['users_list'].filter( (user) => user['name'] === name && user["job"] === job); 
}


app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    let user = addUser(userToAdd);
    if (!user) {
        // conflict in post
        res.status(409).send('Unable to Record User');
    } 
    else {
        res.status(201).send({newUser: user});
    } 
});

function addUser(user){
    // don't expect to occur often
    let user_id = generate_random_id()

    // retry random number generation
    let iteration_count = 0
    let list_length = users["users_list"].length;
    // Retries tested by setting retry to a low number
    let max_iterations = list_length*2;
    while(duplicate_id(user_id) && iteration_count <= max_iterations){
        user_id = generate_random_id();
        iteration_count++;
    }
    
    // if retries failed set id to current time
    if (iteration_count >= max_iterations) {
        user_id = String(Date.now()*list_length);
    }
    user["id"] = user_id;

    // Code to add users
    users['users_list'].push(user);
    return user;
}

app.delete('/users/:id', (req, res) => {
    let id = req.params['id']; //or req.params.id
    let successfully_deleted = removeUserById(id);
    if(!successfully_deleted) {
        res.status(404).end()
    } else {
        res.status(204).send(users);
    }
    
});

function removeUserById(id) {
    const past_users = users['users_list'].length
    // validate that the index is less than the size of the arrary of users
    let index = parseInt(id)
    if (index >=past_users) {
        return false;
    }
    users["users_list"].splice(parseInt(id),1);
    // validate that really users were removed
    return !(past_users === users['users_list'].length)
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// validate that a duplicate id is not stored in the database
function duplicate_id(new_id){
    for (let i = 0; i < users['users_list'].length; i++){
        if (users['users_list'][i]['id'] === new_id){
            return true;
        }
    }
    return false;
}

// Generates a random id w ith numbers and letters
function generate_random_id() {
    let list_length = users['users_list'].length;
    // generate a random number between 1 and (list_length+1)*2
    let new_id = Math.floor(
        (Math.random() * (list_length+2) +1).toString()
    );
    // add (half the number of users) number of random letters to the id
    let number_letters = Math.floor(list_length/2);
    for (let i = 0; i < number_letters; i++){
        new_id += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return new_id;
}