const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
const { number } = require('yup/lib/locale');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

const app = express();

let schema = yup.object().shape({
    slug: yup.string().trim(),
    url: yup.string().trim().url().required(),
});

app.use(helmet());
app.use(cors())
app.use(morgan('common'));
app.use(express.json());

app.get('/', (req,res)=> {
    res.json({
        message: "You are awesome"
    })
})

app.post('/url', async (req, res, next)=>{
    let { slug, url} = req.body;
    try {
        await schema.validate({
          slug,
          url,
        });
        // if (url.includes('cdg.sh')) {
        //   throw new Error('Stop it. 🛑');
        // }
        if (!slug) {
          slug = nanoid(6);
        } else {
          const existing = await urls.findOne({ slug });
          if (existing) {
            throw new Error('So sorry bro. Slug is in use!');
          }
        }
        slug = slug.toLowerCase();
        const newUrl = {
          url,
          slug,
          clicks:0
        };
        const created = await urls.insert(newUrl);
        res.json(created);
      } catch (error) {
        next(error);
      }
    });

const notFoundPath = path.join(__dirname, 'public/404.html');

app.get('/urls', async (req, res) => {
    try {
        const result = await urls.find();
        // console.log(result);
        // for (let r of result){
        // console.log(r.slug)}
        res.status(200)
        res.type('application/json')
        res.json(result)
        // res.end();

      } catch(e) {
        res.status(500)
        res.type('application/json')
        res.json({ error: e })
    }
});

app.get('/:id', async (req, res, next) => {
    // const { id: slug } = req.params;
    let slug = req.params.id
    // console.log(req.params)
    try {
      const url = await urls.findOne({ slug });
      if (url) {
        await urls.update(
            {slug: url.slug},
            {$inc: { clicks: 1 }}
        )
        return res.redirect(url.url);
      }
      return res.status(404).sendFile(notFoundPath);
    } catch (error) {
      return res.status(404).sendFile(notFoundPath);
    }
  });

//   app.get('/delete/:id', async (req, res, next) => {
//     // const { id: slug } = req.params;
//     let slug = req.params.id
//     console.log(slug)
//     try {
//       const url = await urls.findOne({ slug });
//       if (url) {
//         console.log(url)
//         const syntax = `ObjectId(${url._id})`
//         console.log(syntax)
//         await urls.deleteOne({ "_id": syntax })
//         res.status(200)
//         res.end();
//       }
//       return res.status(404).sendFile(notFoundPath);
//     } catch (error) {
//       return res.status(404).sendFile(notFoundPath);
//     }
//   });

//   app.put('/delete/:id', async (req, res, next) => {
//     // const { id: slug } = req.params;
//     let slug = req.body.id
//     console.log(req)
//     console.log(slug)
//     try {
//       const url = await urls.findOne({ slug });
//       if (url) {
//         console.log(url)
//         const syntax = `ObjectId(${url._id})`
//         console.log(syntax)
//         await urls.deleteOne({ "_id": syntax })
//         res.end();
//       }
//       return res.status(404).sendFile(notFoundPath);
//     } catch (error) {
//       return res.status(404).sendFile(notFoundPath);
//     }
//   });

app.use((error, req, res, next) => {
    if (error.status) {
      res.status(error.status);
    } else {
      res.status(500);
      console.log(error.message)
    }
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
  });


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Application has started on ${PORT} on ${new Date()}`)
})

// cencoiwenoweiocweiocw