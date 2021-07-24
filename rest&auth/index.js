const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Joi = require('joi'); 

const schema = Joi.object({ 
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  name: Joi.string().min(3).max(15),
  lastName:  Joi.string().min(3).max(15),
}); 

const secretKey = "key";

const isEmailUnique=(users, user)=>{
    return !users.some((item)=>item.email===user.email);
}

const isCorrectToken = (ctx,next) =>{
  if (ctx.request.headers.token === secretKey){
    next();
  }
  else {
    ctx.status = 406;
  }
}

const app = new Koa();
const router = new Router();
const API_PORT = 3005;

app.use(bodyParser({ jsonLimit: '20mb', enableTypes: ['json', 'form', 'text'] }));

router.post('/signup', (ctx) => {
  const data = JSON.parse(fs.readFileSync('./users.json'));
  if (schema.validate(ctx.request.body).error || !isEmailUnique(data, schema.validate(ctx.request.body).value)){
    ctx.body = "check form please";
    ctx.status = 400;
  }else{
    data.push(schema.validate(ctx.request.body).value)
    fs.writeFileSync('./users.json', JSON.stringify(data));
    ctx.body = secretKey;
    ctx.status = 200;
  }
});

router.post('/login', (ctx) => {
  const data = JSON.parse(fs.readFileSync('./users.json'));
  if (schema.validate(ctx.request.body).error || isEmailUnique(data, schema.validate(ctx.request.body).value)){
    ctx.body = "check form please";
    ctx.status = 400;
  }else{
    const user = schema.validate(ctx.request.body).value;
    if (data.some((item)=>item.email===user.email && item.password===user.password)){
       ctx.body = secretKey;
       ctx.status = 200;
  } 
  }
});


router.get('/users', ctx => {
  const data = JSON.parse(fs.readFileSync('./users.json'));
  ctx.body = data;
});

router.delete('/user', isCorrectToken ,ctx => {
  if (schema.validate(ctx.request.body).error){
    ctx.body = "check form please";
    ctx.status = 400;
  }else{
    const user = schema.validate(ctx.request.body).value;
    const data = JSON.parse(fs.readFileSync('./users.json'));
    const newData= data.filter((item)=>{item.email!==user.email});
    fs.writeFileSync('./users.json', JSON.stringify(newData));
    ctx.status = 200;
  }
});

router.put('/user', isCorrectToken, ctx => {
  if (schema.validate(ctx.request.body).error){
    ctx.body = "check form please";
  }else{
    const user = schema.validate(ctx.request.body).value;
    const data = JSON.parse(fs.readFileSync('./users.json'));
    data.forEach((item) => {
      if (item.email === user.email)
      {
        item.name = user.name;
        item.lastName = user.lastName;
      }
    })
    fs.writeFileSync('./users.json', JSON.stringify(data));
    ctx.status = 200;
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(API_PORT, () => {
  console.log(`Api server listening on ${API_PORT}`);
});