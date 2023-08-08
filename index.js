const http = require('http');
const url = require('url');
const fs = require('fs');

const slug = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev_data/data.json`, 'utf-8'); // we do it here now beacuse jb phle ki trah niche kr rhe the toh ye file hrr brr read ho rhi thi then hrr brr print ho rhi thi then again read again print ab isko synchronously read kr rhe h sbse starting m toh ye bss ek brr starting m read hogi then agle step m idhr hi parse bhi krdi then print tb tbb hogi jb jb call hogi isiliye usko niche els if m rkha hai
const dataObj = JSON.parse(data);

const slugify = dataObj.map((el) => slug(el.productName, { lower: true }));
console.log(slugify);

const server = http.createServer((req, res) => {
  // console.log(req);   This will print all the requests that the server is making to the browser

  //this format of const allow us to create multiple variables at a time
  const { query, pathname } = url.parse(req.url, true); // parse is used to pasrse some extra elements out of the url like /pr oduct?i=0 here id =0 is externally parsed

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    //map is basically a for each loop where data is converted into array

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    res.end(output);
  }
  //Product page
  else if (pathname === '/product') {
    // console.log(query);

    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  //API page
  else if (pathname === '/api') {
    // fs.readFile(`${__dirname}/dev_data/data.json`, 'utf-8',(err,data)=>{
    //     const productData = JSON.parse(data);     //JSON.parse will convert the json format data into a js one i.e. into a js object

    res.writeHead(200, { 'content-type': 'application/JSON' }); //to tell the browser that we are sending JSON
    res.end(data); //response is always in the form of string therefore initially dat is our string then we converted it inot a js object i.e. productData therefore we here are sending data not productData
  }

  //Error page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello=world', // we can also specify our own made headers
      //point to note =>>>> all these header are need to be send before the res.end
    });
    res.end('<h1>piyush Page not found<h1/>');
    //set the status code to 404 tosee this check the network area in the develor tools it can also set headers for that we nee to specify an object here and then in that we put the headers that we ant to send

    //http header is a piece of information about the response that are we sending back
    // res.end('Error BahinChod');
  }
});

server.listen(8000, () => {
  console.log('listening to the server 8000');
});
