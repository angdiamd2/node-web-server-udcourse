const express = require('express');
var app = express();   //make a new express app

//#######
//You could then type below and use res,send to send a string, html or object - but this too literal
app.get('/bad',(req,res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});
//A better way to do this is to pass whole html files
//If this is  a static page - really limiting then you can use
app.use(express.static(__dirname + '/public')); //which means if you type localhost:3000/help.html it will retrieve your page
//but this is useless- static- if you never change that it is only good for a credits or help page
/*Next option is to be able to pass html pages with an object where we can use key/value of that object inside the html using {{}}
First you register
app.set('view engine','hbs');
const hbs = require('hbs');
Now you can use res.render
app.get('/',(req,res)=>{
  res.render('home.hbs',{
    pageTitle: 'My Home Page',
    welcomeMessage: 'Welcome to my website',
    currentYear: new Date().getFullYear()
  });
});
which means if you type / then it will go to your Views folder load the home.hbs which is written in html with access to
key/value of the object after home.hbs
//Next option is to make sure repetitive part of the code that appears in multiple pages such as header, footer does not have to be implemented
on every single page
hbs.registerPartials(__dirname + '/views/partials');
Inside partials create once the html that is repeated and in the hbs files you type {{> footer.hbs}}  footer.hbs is in the partials folder
Finally if you have a key/valu pair that appears in multiple objects in app.get ... res.render then you can avoid including this inthe object
Instead you register a helper function
hbs.registerHelper('getCurrentYear',()=> {
  return new Date().getFullYear()
});
Now anywhere in you hbs files you can call {{filename argument1 argument2}} where argument1, argument2 can still being passed via the object in res.render
app.use((req,res,next)=> {...next()}   allows you to expand express and make sure whenever your app runs that what is defined in app.use is executed e.g. logs with timestamp
*/
//#######



//Lect4  visit https://www.npmjs.com/package/hbs and http://handlebarsjs.com
//Install it $npm install hbs@4.0.0 --save . This is another way of pushing html to the server with templates (have variabes etc.)
app.set('view engine','hbs'); //this tells express what view engine to use
//make a directory views which is the standard directory express uses for templates
//create a file about.hbs which is the 1st template we will create for the about page. Copy code from help.html to the about.hbs

const hbs = require('hbs');
//Lecture5    NOTE IT IS QUITE CRITICAL THE SEQUENCE OF EVENT CALLING ABOVE/BELOW
//we register the partials folder below so parts of the webpages that are repeatable are controlled from one place
hbs.registerPartials(__dirname + '/views/partials');
//make sure in the terminal to run $nodemon server.js -e js,hbs This ensures that nodemon runs with extensions of js and hbs files

//can also register helper function. customized functions available to partials
//Helper functions     hbs.registerHelper(nameOfFunction,Function)
hbs.registerHelper('getCurrentYear',()=> {
  return new Date().getFullYear()
});  //now you can use this {{getCurrentYear}} in your partials instead of pushing it via the res.render('*.hbs',object)
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});


//<C> added on Lect3. Use of express middlewear - 3rd party add on express - defines how the express application works
app.use(express.static(__dirname + '/public')); //static takes the literal path of the folder
//__dirname is the variable that holds the path to the project node-web-server and then we concatenate public folder
//$nodemon server.js and n the browser localhost:3000/help.html. In the static webpage we can inject files,images,js,css etc.

//app.use(function) is how to write middlewear - extending the express functionality
//it takes 3 arguments the usuals req,res and next. If next() does not kick in then the rest of the code below is never run
//next() assures that we are waiting for everything prior to that inside the function to execute e.g. get login details before proceeding
const fs = require('fs');
app.use((req,res,next)=> {
  //the req holds a ton of information about the request form the server(webhook etc)
  //go to http://expressjs.com/en/4x/api.html#req to see all the items being held within the req
  var now  = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;   //re.method will be GET  req.url = '/about'

  console.log(log);
  fs.appendFile('server.log',log + '\n',(err)=>{     /*(nameOfFile,whatToWrite,errorFunction for nodev7onwards)*/
    if (err){
      console.log('Unable to append to server.log.');
    }
  });
  next();
});
// //sometimes you want to omit the next() so execution stops
// app.use((req,res,next)=>{
//   res.render('maintenance.hbs');
//   //this does not have next() so execution will stop right here
// });
//Because the line below is run higher the maintenance will not be executed when you run the static page /help, so you put it below after maintenance
//app.use(express.static(__dirname + '/public'));


//<A> Lect1: setup http route handlers, for example someone visits our webpage then this is a request
//app.get(url,function to run that determines what to send back once the page is visited)
//visit url is a request. Here we start by using the local directory on the PC '/'
   /*app.get('/',(req,res) => {
//quite important that express needs the 2 arguments req for request and res for response
//req holds a ton of information on how the request was made , header,body , method, path
//res has a lot of methods to choose how to respond to the request - e.g. set http status code
  //res.send('Hello Express!');  //so someone request the url he gets the response of the string 'Hello Express'
  //res.send('<h1>Hello Express!</h1>');
    res.send({      //express realises that we are sending an object so it converts it to a JSON and shows it on the page
    name: 'Angelos',
    likes: [
      'Chess',
      'Coding'
    ]
  });   //data will show using JSON view
});  */

//<B>
app.get('/',(req,res)=>{
  res.render('home.hbs',{
    pageTitle: 'My Home Page',
    welcomeMessage: 'Welcome to my website',
    currentYear: new Date().getFullYear()
  });
});


//here is another request for another webpage we want to create
app.get('/about',(req,res) => {
  //res.send('About Page');   //try in Chrome localhost:3000/about

  //Once about.hbs is constructed
  //res.render('about.hbs');  //this will run about.hbs template in the views
  //node knows where to look because we set app.set('view engine','hbs');
  //now we can use the template capabilities to pass an object which we then read in the
  //about.hbs file
  res.render('about.hbs',{
    pageTitle: 'About ME Page',
    currentYear: new Date().getFullYear(),   //new Date() is a new object of the Date
    currentDate: new Date()
  });

});  //So now we can go on and create infinite web pages




          // app.get('/bad',(req,res) => {
          //   res.send({
          //     errorMessage: 'Unable to handle request'
          //   });
          // });


//<A> we need to bind the application to a port in our machine (3000 is the common port to use) so it starts listening
//app.listen(3000);  //$nodemon server.js will keep running for ever or crash if there is an error you will have to stop it manually Ctrl+C
//app.listen takes a 2nd optional argument, a function that let us do something once the server is up
app.listen(3000,()=>{
  console.log('Server is up on port 3000'); //this will type to the terminal once the server is ready
});
//Server is now up. Go to Chrome and type localhost:3000 See the page showing 'Hello Express'
//Check the Developer Tools>Network Refresh page and see localhost request.
//See that it says Type>document. Click to see the details in Headers. This stores a ton of information e.g. Request URL, Request Method GET, Status Code.
//In one of the Response Headers we have Content-Type shows text/html.
//note that when we pass in response res.send an object that is then converted into a JSON then the Content-Type changes to application/json

//Create a new folder public and within it help.html Everything in the public folder will
//be accessible to the server - to anybody so be careful what you place in there
//what we are trying to achieve is that we don't have to create a new app.get route for everything
//we want to provide to the website - it would be too slow.


//GIT
//Download git from https://git-scm.com
//git --versions to verify that git is installed
//once in the terminal you are inside the node-web-server which is the main folder of your poroject
//you run git init This will create a repository for your folder  a .git where the version controlling fo your work will happen
//try this with ls -a to see all your directories/file (hidden and unhidden).
//if folders/files are hidden then
//$defaults write com.apple.finder AppleShowAllFiles YES
//$killall Finder    so now you can see hidden folders in your Finder window
//Do not mess by going manually inside the .git folder. You terminal/bash commands to control it
