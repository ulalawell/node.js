var Koa = require('koa');
var serve = require('koa-static');
var redisStore = require('koa-redis');
var Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
var session = require('koa-generic-session');
const fs = require('fs');
const Joi = require('joi'); 


const schema = Joi.object({ 
  name: Joi.string().min(3).max(15).required(),
  lastName:  Joi.string().min(3).max(15),
  framework: Joi.string().required(),
  frameworkReason: Joi.string().max(100)
}); 

const router = new Router();
const app = new Koa();


app.use(serve('./public'));

router.post('/', (ctx, next) => {
  if (schema.validate(ctx.request.body).error){
    ctx.body = "check form please";
  }else{
    ctx.body = 'enter "http://localhost:3000/info" to see data';

    const data = JSON.parse(fs.readFileSync('./formInfo.json'));
    data.push(schema.validate(ctx.request.body))
    fs.writeFileSync('formInfo.json', JSON.stringify(data));

  }
});

router.get('/counter', (ctx) => {
  session.count = session.count || 0;
  session.count += 1;
  ctx.body = session.count;
});

router.get('/info', ctx => {
  const data = fs.readFileSync('./formInfo.json');
  ctx.body = JSON.parse(data);
});


app.use(bodyParser())
app.use(router.routes());
app.use(router.allowedMethods());
app.use(session({
  store: redisStore(),
}));
app.listen(3000);