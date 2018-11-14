// login & register

const express=require('express');

const router=express.Router();
const User=require('../../models/User');
//const bcrypt =require('bcrypt-nodejs'); //加密
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken'); //获取token
const keys=require('../../config/keys');
const passport=require('passport'); //token 认证
//$route GET api/user/test
//@desc 返回请求的数据
//@access publice
// router.get('/test',(req,res)=>{
// 	res.json({msg:"login work"})
// })

//$route POST api/user/register
//@desc 返回请求的数据
//@access publice
router.post('/register',(req,res)=>{
	//console.log(req.body);

	//查询数据库是否拥有邮箱
	User.findOne({email:req.body.email})
	.then((user)=>{
		if(user){
			return res.status(400).json('邮箱已被注册')
		}else{

			const avatar = gravatar.url(req.body.email,{s: '200', r: 'pg', d: 'mm'});
			
			const newUser=new User({
				name:req.body.name,
				email:req.body.email,
				avatar:avatar,
				password:req.body.password,
				identity:req.body.identity
			});
			// 进行加密（加盐）
			bcrypt.genSalt(10, function(err, salt) {

			    bcrypt.hash(newUser.password, salt, function(err, hash) {

			    	if(err) throw err;
			    	newUser.password = hash;
				  		newUser.save()
				  		.then(user =>res.json(user))
				  		.catch(err=>console.log(err));
			    	

			        
			    });
			});
			
			
	
		}
	})
	
})
//$route POST api/user/login
//@desc 返回请求的数据 tocken jwt passport
//@access publice
//
router.post('/login',(req,res)=>{
	const email=req.body.email;
	const password=req.body.password;

	//查询数据库
	User.findOne({email})
		.then(user=>{
			if(!user){
				return res.status(404).json('用户不存在')
			}

			//密码匹配
			bcrypt.compare(password, user.password)
				.then(isMatch=>{

					if(isMatch){
						const rule={
							id:user.id,
							name:user.name,
							avatar:user.avatar,
							identity:user.identity};
						jwt.sign(rule,keys.secretOYkey,{expiresIn:3600},(err,token)=>{

							if(err) throw err;
							res.json({success:true,token:'Bearer '+token});

						})
					}else{
						return res.status(400).json('密码错误')
					}
				})
				.catch(err=>console.log(err))
		})
})
//$route GET api/user/current
//@desc return current user
//@access private

//验证token
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) => {
    // 如果passport是done(null,user) 即返回回来的是查询的用户信息。则res.send，否则箭头函数不执行
    res.json({
    	id:req.user.id,
    	name:req.user.name,
    	email:req.user.email,
    	identity:req.user.identity
    });
})

module.exports=router;