var express = require("express");
var cors = require("cors");
var app = express();
const models=require('./models')
// const port = 8080;
const port = process.env.PORT || 8080;
const multer = require("multer");
const upload = multer({ 
    storage:multer.diskStorage({
        destination:function(req, file, cb){
            cb(null,"uploads")
        },
        filename:function(req, file, cb){
            cb(null, file.originalname)
        }
    }),    
})
app.use(express.json());
app.use(cors());
app.use("/uploads",express.static("uploads"));

app.get('/banners',(req,res)=>{
    models.Banner.findAll({limit:2})
    .then((result)=>{
        res.send({
            banners:result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send(500).send("에러가 발생했습니다.")
    })
})

app.get('/products', (req, res) => {
    // 조회 부분 구현
    // models.Product.findAll() 모든 함수를 찾는다.
    models.Product.findAll(
        // {limit:1} 로 검색 될 상품 개수를 지정 할 수 있다.
        // {order:[[]]} 정렬 순서를 정할 수 있다. DESC 는 내림 차순, ASC 는 오름 차순
        {
            order:[['createdAt','DESC']],
            attributes:["id","name","price","seller","description","imageUrl","createdAt"]
    }
    )
    .then((result)=>{
        res.send({
            product:result,
        })
    })
    .catch((error)=>{
        console.error(error);
        res.send('에러발생')
    })
})
// 
app.get('/products/:id', (req, res) => {
    const params=req.params;
    const {id}=params;
    // models.Product.findOne() 1개 함수만 찾는다.
    models.Product.findOne({
        where:{id:id}
    })
    .then((result)=>{
        console.log("product:",result);
        res.send({product:result})
    })
    .catch((error)=>{
        console.error(error);
        res.status(400).send('에러발생')
    })
})

app.post('/image',upload.single('image'),function(req,res){
	const file=req.file;
    console.log(file);
	res.send({
		imageUrl:file.path,
	})
})

app.post('/products', (req, res) => {
    const body=req.body;
    // const body=req.body; 화면 정보를 담아서 보낸다(등록한다.) 그걸 body에 넣는다.
    const {name, price, seller, description, imageUrl}=body;
    // models.Product models.테이블명(여기선 models 폴더 안에 product.js 안에 테이블)
    // create : 생성 / then 그리고나서 성공시 / catch 실패시
    if(!name || !price || !seller || !description){
        res.send("모든 필드를 입력해주세요")
        // 이걸 방어 코드라고 부른다.
    }
    models.Product.create({name, price, seller, description, imageUrl})
    .then((result)=>{
        console.log('상품 생성 결과',result);
        res.send({result})
    })
    .catch((error)=>{
        console.error(error);
        res.status(400).send('상품 업로드에 문제가 발생 했습니다.')
    })
    // res.send({body:body}) 키랑 값이 같으면 생략 가능
    // res.send({body})
})

app.post('/login', (req, res) => {
    res.send('로그인이 완료 되었습니다.')
})

app.listen(port, () => {
    console.log('망고샵의 서버가 돌아가고 있습니다.');
    models.sequelize.sync()
    .then(()=>{
        console.log('DB연결성공');
    })
    .catch((err)=>{
        console.error(err);
        console.log('DB연결실패');
        process.exit();
    });
})